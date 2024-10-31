import { AvailabilityContextProvider } from "@/app/components/availability/availability-context";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <AvailabilityContextProvider>{children}</AvailabilityContextProvider>
    );
}
