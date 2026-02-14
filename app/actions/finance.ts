"use server";

import {
  BudgetPeriod,
  CategoryType,
  Prisma,
  TransactionType,
} from "@prisma/client";
import { revalidatePath, revalidateTag } from "next/cache";
import { z } from "zod";

import { prisma } from "@/lib/prisma";
import { createAuditLog } from "@/lib/security/audit-log";
import { createSupabaseActionClient } from "@/lib/supabase/actions";

type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string; fields?: Record<string, string[]> };

const optionalString = (maxLength: number) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") {
        return value;
      }
      const trimmed = value.trim();
      return trimmed === "" ? undefined : trimmed;
    },
    z.string().max(maxLength).optional(),
  );

const transactionSchema = z.object({
  accountId: z.string().min(1),
  categoryId: z.string().min(1),
  type: z.nativeEnum(TransactionType),
  amount: z.coerce.number().positive(),
  transactionAt: z.coerce.date(),
  description: optionalString(255),
  currency: optionalString(3),
});

const budgetSchema = z
  .object({
    name: z.string().trim().min(1).max(120),
    period: z.nativeEnum(BudgetPeriod),
    periodStart: z.coerce.date(),
    periodEnd: z.coerce.date(),
    limitAmount: z.coerce.number().positive(),
    categoryId: optionalString(255),
    currency: optionalString(3),
    isActive: z.coerce.boolean().optional(),
  })
  .refine((payload) => payload.periodEnd > payload.periodStart, {
    message: "periodEnd must be greater than periodStart",
    path: ["periodEnd"],
  });

const updateCategorySchema = z
  .object({
    categoryId: z.string().min(1),
    name: optionalString(100),
    type: z.nativeEnum(CategoryType).optional(),
    isSystem: z.coerce.boolean().optional(),
  })
  .refine(
    (payload) =>
      payload.name !== undefined ||
      payload.type !== undefined ||
      payload.isSystem !== undefined,
    {
      message: "Provide at least one field to update",
      path: ["categoryId"],
    },
  );

const toFieldErrors = (error: z.ZodError): Record<string, string[]> => {
  const fieldErrors = error.flatten().fieldErrors as Record<
    string,
    string[] | undefined
  >;

  return Object.entries(fieldErrors).reduce<Record<string, string[]>>(
    (acc, [key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        acc[key] = value;
      }
      return acc;
    },
    {},
  );
};

const parseFormData = (formData: FormData) => Object.fromEntries(formData.entries());

async function requireAuthenticatedUserId() {
  const supabase = await createSupabaseActionClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("Unauthorized");
  }

  return user.id;
}

export async function createTransaction(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const payload = transactionSchema.parse(parseFormData(formData));
    const userId = await requireAuthenticatedUserId();
    const currency = payload.currency?.toUpperCase() ?? "CAD";

    const [account, category] = await Promise.all([
      prisma.account.findFirst({
        where: { id: payload.accountId, userId, deletedAt: null },
        select: { id: true },
      }),
      prisma.category.findFirst({
        where: { id: payload.categoryId, userId, deletedAt: null },
        select: { id: true },
      }),
    ]);

    if (!account || !category) {
      return { ok: false, error: "Invalid account or category for this user" };
    }

    const transaction = await prisma.transaction.create({
      data: {
        userId,
        accountId: payload.accountId,
        categoryId: payload.categoryId,
        type: payload.type,
        amount: new Prisma.Decimal(payload.amount),
        currency,
        description: payload.description,
        transactionAt: payload.transactionAt,
      },
      select: { id: true },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidateTag("transactions", "max");
    await createAuditLog({
      actorUserId: userId,
      targetUserId: userId,
      action: "TRANSACTION_CREATE",
      resource: "transactions",
      metadata: { transactionId: transaction.id },
    });
    return { ok: true, data: transaction };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, error: "Validation failed", fields: toFieldErrors(error) };
    }
    return { ok: false, error: "Failed to create transaction" };
  }
}

export async function createBudget(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const payload = budgetSchema.parse(parseFormData(formData));
    const userId = await requireAuthenticatedUserId();
    const currency = payload.currency?.toUpperCase() ?? "CAD";

    if (payload.categoryId) {
      const category = await prisma.category.findFirst({
        where: { id: payload.categoryId, userId, deletedAt: null },
        select: { id: true },
      });

      if (!category) {
        return { ok: false, error: "Invalid category for this user" };
      }
    }

    const budget = await prisma.budget.create({
      data: {
        userId,
        name: payload.name,
        period: payload.period,
        periodStart: payload.periodStart,
        periodEnd: payload.periodEnd,
        limitAmount: new Prisma.Decimal(payload.limitAmount),
        categoryId: payload.categoryId,
        currency,
        isActive: payload.isActive ?? true,
      },
      select: { id: true },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidateTag("budgets", "max");
    await createAuditLog({
      actorUserId: userId,
      targetUserId: userId,
      action: "BUDGET_CREATE",
      resource: "budgets",
      metadata: { budgetId: budget.id },
    });
    return { ok: true, data: budget };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, error: "Validation failed", fields: toFieldErrors(error) };
    }
    return { ok: false, error: "Failed to create budget" };
  }
}

export async function updateCategory(formData: FormData): Promise<ActionResult<{ id: string }>> {
  try {
    const payload = updateCategorySchema.parse(parseFormData(formData));
    const userId = await requireAuthenticatedUserId();

    const updated = await prisma.category.updateMany({
      where: {
        id: payload.categoryId,
        userId,
        deletedAt: null,
      },
      data: {
        ...(payload.name !== undefined ? { name: payload.name } : {}),
        ...(payload.type !== undefined ? { type: payload.type } : {}),
        ...(payload.isSystem !== undefined ? { isSystem: payload.isSystem } : {}),
      },
    });

    if (updated.count === 0) {
      return { ok: false, error: "Category not found for this user" };
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    revalidateTag("categories", "max");
    revalidateTag("transactions", "max");
    await createAuditLog({
      actorUserId: userId,
      targetUserId: userId,
      action: "CATEGORY_UPDATE",
      resource: "categories",
      metadata: { categoryId: payload.categoryId },
    });
    return { ok: true, data: { id: payload.categoryId } };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { ok: false, error: "Validation failed", fields: toFieldErrors(error) };
    }
    return { ok: false, error: "Failed to update category" };
  }
}
