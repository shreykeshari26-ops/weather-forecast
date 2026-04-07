function BackgroundEffects() {
  return (
    <>
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(255,255,255,0.5),transparent_18%),radial-gradient(circle_at_82%_16%,rgba(186,230,253,0.42),transparent_22%),radial-gradient(circle_at_50%_78%,rgba(224,242,254,0.34),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.18),rgba(255,255,255,0))] blur-xl animate-ambient-shift" />
      <div className="pointer-events-none fixed inset-[-12%] animate-ambient-drift bg-[radial-gradient(circle_at_24%_30%,rgba(191,219,254,0.2),transparent_24%),radial-gradient(circle_at_74%_62%,rgba(125,211,252,0.18),transparent_24%),radial-gradient(circle_at_52%_18%,rgba(255,255,255,0.18),transparent_18%)] blur-[52px]" />
      <div className="pointer-events-none fixed left-[-72px] top-14 h-80 w-80 animate-float-orb rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.65),transparent_64%)] blur-[56px] mix-blend-screen" />
      <div className="pointer-events-none fixed bottom-2 right-[-120px] h-[380px] w-[380px] animate-[float-orb_18s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,rgba(147,197,253,0.36),transparent_68%)] blur-[60px] mix-blend-screen" />
      <div className="pointer-events-none fixed inset-0 opacity-35 [background-image:linear-gradient(rgba(255,255,255,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.18)_1px,transparent_1px)] [background-size:88px_88px] [mask-image:linear-gradient(180deg,rgba(0,0,0,0.35),transparent_92%)]" />
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(255,255,255,0.3),transparent)] blur-2xl" />
    </>
  );
}

export default BackgroundEffects;
