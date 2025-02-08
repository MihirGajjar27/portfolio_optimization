import React from "react";
import Header from "@/components/Header";
import RedirectButton from "@/components/RedirectButton";

export default function Home() {
	return(
		<div>
			<Header/>
			<div className={"bg-gray-200 text-black h-90 p-5 px-10"}>
				<div className={"justify-items-center w-full py-10"}>
					<div className={"p-10 bg-gray-100 backdrop-blur-2xl rounded-lg drop-shadow-lg"}>
						<div className={"text-6xl text-black font-normal"}>Seeking Beta</div>
						<div className={"text-lg text-blue-800 font-medium pb-5"}>A risk profiling and portfolio management tool</div>
						<div className={"flex justify-center items-center"}>
							<RedirectButton title={"Take the Quiz"} uri={"/risk_profile_quiz"}/>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}