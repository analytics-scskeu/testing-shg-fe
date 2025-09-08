import backgroundAuth from "@/resources/images/icons/backgroundAuth.svg";
import logo from "@/resources/images/logo.png";
import Image from "next/image";
import dayjs from "dayjs";
import { Link } from "@/i18n/routing";

export default function layout({ children }) {
    return (
        <div className="min-h-screen flex flex-row">
            <div
                className={`hidden md:block flex-grow relative overflow-hidden bg-cover bg-center`}
                style={{ backgroundImage: `url(${backgroundAuth.src})` }}
            ></div>

            {/* Right Side Login Form */}
            <div className="w-[860px] bg-white flex justify-center items-center p-5 md:p-10">
                <div className="max-w-[480px] w-full">
                    <Link className={"mb-20"} href={"/"}>
                        <Image
                            priority
                            className={"w-[147px] h-[48px] md:w-[215px] md:h-[70px] mb-16"}
                            src={logo}
                            alt="Sumitomo Logo"
                        />
                    </Link>

                    {children}

                    <footer className="text-xs text-gray-shade1 mt-20">
                        Copyright © {dayjs().format("YYYY")} Sumitomo Tool.
                    </footer>
                </div>
            </div>
        </div>
    );
}
