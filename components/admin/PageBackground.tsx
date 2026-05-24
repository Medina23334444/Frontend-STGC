// components/users/PageBackground.tsx
export function PageBackground() {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      <div className="absolute top-[-5%] left-[20%] w-[40%] h-[40%] rounded-full bg-sky-200/10 blur-[130px]" />
    </div>
  );
}