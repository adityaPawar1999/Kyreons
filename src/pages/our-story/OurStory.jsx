import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';

export default function OurStory() {
  return (
    <div className="bg-paper text-neutral-900 dark:bg-neutral-950 dark:text-white">
      <section className="relative isolate flex min-h-[560px] items-end overflow-hidden bg-neutral-900 px-[7%] py-16 text-white md:min-h-[680px] md:px-[9.3%] md:py-24">
        <img
          className="absolute inset-0 -z-20 h-full w-full object-cover object-center opacity-65"
          src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=2000&q=85"
          alt="Streetwear inspired by everyday city life"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
        <div className="max-w-3xl">
          <p className="text-[9px] font-semibold tracking-[.18em] text-white/75">A NOTE FROM KYREONS</p>
          <h1 className="my-6 font-display text-[clamp(58px,12vw,132px)] font-semibold leading-[.82] tracking-[-.09em]">
            OUR<br /><span className="text-acid">STORY.</span>
          </h1>
          <p className="max-w-xl text-sm leading-7 text-white/85 md:text-base">
            Inspired by everywhere. Made for the way you choose to show up.
          </p>
        </div>
      </section>

      <section className="grid gap-10 px-[7%] py-16 md:grid-cols-[.8fr_1.2fr] md:gap-16 md:px-[12%] md:py-28">
        <div>
          <p className="text-[9px] font-semibold tracking-[.18em] text-neutral-500 dark:text-neutral-400">01 / WHERE IT BEGINS</p>
          <h2 className="mt-5 font-display text-5xl font-medium leading-[.9] tracking-[-.08em] md:text-7xl">
            A little<br />in-between.
          </h2>
        </div>
        <div className="max-w-2xl space-y-5 text-sm leading-7 text-neutral-600 dark:text-neutral-300 md:text-base">
          <p>
            Kyreons takes its cues from the energy of Seoul, the details of Tokyo,
            and the individuality found everywhere in between. We make clothes
            for people who take inspiration and make it their own.
          </p>
          <p>
            Our pieces are designed to feel easy to wear and personal from the
            first time you put them on. Relaxed shapes, thoughtful details, and
            room to bring your own point of view.
          </p>
        </div>
      </section>

      <section className="grid md:min-h-[560px] md:grid-cols-2">
        <div className="relative min-h-[360px] overflow-hidden bg-neutral-200 dark:bg-neutral-800 md:min-h-0">
          <img
            className="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=1300&q=85"
            loading="lazy"
            alt="Thoughtfully styled everyday clothing"
          />
        </div>
        <div className="flex flex-col justify-center bg-acid px-[8%] py-16 md:px-[12%] md:py-20">
          <p className="text-[9px] font-semibold tracking-[.18em] text-neutral-700">02 / OUR POINT OF VIEW</p>
          <h2 className="my-6 font-display text-[clamp(48px,7vw,84px)] font-semibold leading-[.85] tracking-[-.09em] text-neutral-900">
            Wear it<br />your way.
          </h2>
          <p className="max-w-md text-sm leading-7 text-neutral-800">
            Style is not a set of rules to follow. It is a way to make the things
            you love feel like they belong to you. Kyreons is here for that
            freedom, every day.
          </p>
          <a className="mt-8 inline-flex w-fit items-center gap-3 border-b border-neutral-900 pb-2 text-[9px] font-bold tracking-[.12em] text-neutral-900" href="#shop">
            FIND YOUR PIECE <ArrowOutwardIcon />
          </a>
        </div>
      </section>

      <section className="px-[7%] py-16 text-center md:px-[12%] md:py-24">
        <p className="text-[9px] font-semibold tracking-[.18em] text-neutral-500 dark:text-neutral-400">MADE FOR THE IN-BETWEEN</p>
        <h2 className="mx-auto my-6 max-w-4xl font-display text-[clamp(40px,8vw,88px)] font-medium leading-[.95] tracking-[-.08em]">
          Inspired by everywhere.<br /><span className="text-[#9ca87c] dark:text-acid">Worn like it is yours.</span>
        </h2>
        <p className="mx-auto max-w-lg text-sm leading-7 text-neutral-600 dark:text-neutral-300">
          Make room to be yourself. Take what inspires you and make it your own.
        </p>
      </section>
    </div>
  );
}
