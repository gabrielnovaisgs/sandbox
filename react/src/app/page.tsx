import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col gap-2">
      <Link href={"/pocs/reducer"}>Reducer</Link>
      <Link href={"/pocs/reducer-context"}>Reducer + API Context</Link>
      <Link href={"/pocs/drag-drop"}>Todo list drag and drop</Link>
    </div>
  );
}
