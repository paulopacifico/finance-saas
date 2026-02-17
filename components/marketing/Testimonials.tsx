const testimonials = [
  {
    quote: "We finally track monthly expenses without disconnected spreadsheets.",
    author: "Family S., Toronto",
  },
  {
    quote: "Category visibility helped us reduce recurring spending in just 2 months.",
    author: "Family P., Vancouver",
  },
];

export function Testimonials() {
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {testimonials.map((item) => (
        <figure key={item.author} className="rounded-xl border border-zinc-200 bg-white p-5">
          <blockquote className="text-sm text-zinc-700">&ldquo;{item.quote}&rdquo;</blockquote>
          <figcaption className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-zinc-500">
            {item.author}
          </figcaption>
        </figure>
      ))}
    </section>
  );
}
