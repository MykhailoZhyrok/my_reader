import Image from "next/image";
import {Button} from "@/components/ui/button"
import Link from "next/link";

export default function Home() {
    return (
        <div className="flex items-center justify-center h-dvh">
            <div className={"flex flex-col items-center justify-center gap-4"}>
                <h1>Wellcome to MOLODOYpolek</h1>
                <Button asChild variant="outline">
                    <Link href="/library/">Insert</Link>
                </Button>
            </div>
        </div>
    );
}
