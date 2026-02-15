import Image from "next/image";

const features = [
  {
    icon: "/landing/icons/feature1.webp",
    title: "Real-time tracking",
    description: "Monitor transactions with immediate updates and relevant alerts.",
  },
  {
    icon: "/landing/icons/feature2.webp",
    title: "Smart budgeting",
    description: "Receive adjustment suggestions based on your spending patterns.",
  },
  {
    icon: "/landing/icons/feature3.webp",
    title: "Bank integration",
    description: "Centralize your accounts in one secure platform.",
  },
];

export function Features() {
  return (
    <section className="rounded-2xl bg-zinc-50 px-4 py-20 sm:px-6 lg:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <h2 className="text-gradient mb-12 text-center text-4xl font-bold text-zinc-900">
          Essential Features
        </h2>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="animate-slide-up rounded-lg bg-white p-6 shadow-lg transition-shadow hover:shadow-xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <Image
                src={feature.icon}
                alt={feature.title}
                width={64}
                height={64}
                className="mb-4"
              />
              <h3 className="mt-4 text-xl font-semibold text-zinc-900">{feature.title}</h3>
              <p className="mt-2 text-zinc-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
