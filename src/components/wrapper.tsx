export default function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-8 md:mx-auto md:max-w-screen-xl md:px-12 ">
      {children}
    </div>
  );
}
