import React from "react";
import Logo from "@/components/Logo";
import ProgressBar from "@/components/ProgressBar";
import RedirectButton from "@/components/RedirectButton";
import Navbar from "@/components/Navbar";

export default function Header() {
	return(
		<>
			<div className={"flex justify-between bg-gray-200 text-black py-5 px-10"}>
				<Logo/>
				<div className={"flex flex-nowrap flex-row space-x-4"}>
					<Navbar current_page={"home"}/>
				</div>
			</div>
			<ProgressBar/>
		</>
	)
}