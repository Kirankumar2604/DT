import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Dashboard from "./(routes)/dashboard/page";
import Header from "./_components/Header";
import Hero from "./_components/Hero";

export default function Home() {
  return (
    <div>
      <Header/>
      <Hero/>
    </div>
  );
}
