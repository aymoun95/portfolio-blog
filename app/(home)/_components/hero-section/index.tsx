import { SocialLinks } from "./social-links";

export const HeroSection = () => {
  return (
    <section className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
      <div className="max-w-3xl">
        <h1 className="text-5xl font-bold text-foreground mb-6 leading-tight">
          Hi, I'm a <span className="text-primary">Full Stack Developer</span>{" "}
          passionate about creating amazing experiences
        </h1>
        <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
          I build modern web applications using TypeScript, and cutting-edge
          technologies. Welcome to my digital space where I share my journey,
          projects, and thoughts on development.
        </p>
        <SocialLinks />
      </div>
    </section>
  );
};
