import React from "react";
import Link from "next/link";

export default function RedirectButton({uri='/', title}) {
	return(
		<Link href={uri} className={"px-3 py-2 bg-blue-500 hover:bg-blue-700 text-blue-100 drop-shadow-lg rounded-lg transition-all duration-200"}>
			{title}
		</Link>
	)
}