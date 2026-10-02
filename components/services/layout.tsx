import ServiceNavGreen from "@/components/services/service-nav-green";

/* Wraps /services and every /services/[slug] page. */
export default function ServicesLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ServiceNavGreen />
      {children}
    </>
  );
}
