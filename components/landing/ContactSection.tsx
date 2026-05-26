import type { CSSProperties } from "react";

export function ContactSection() {
  return (
    <>
      <div id={"contact"} className={"bg-gradient-to-b from-bg-default to-bg-surface"}>
        <div className={"w-[1240px] max-w-full mx-auto px-5 flex flex-col gap-6 items-center justify-center pt-[20px] pb-[50px] md:pt-[50px] md:pb-[100px]"}>
          <div className={"border border-solid border-border-default rounded-2xl p-[50px] md:p-[150px] bg-bg-surface w-full px-12 py-16"} style={{ maxWidth: "100%" } as CSSProperties}>
            <div className={"flex flex-col gap-8 items-center justify-center"}>
              <div data-level={"1"} className={"text-fg-default tracking-tighter text-[36px] md:text-[46px] font-medium text-center leading-[0.9em]"}>
                {"Talk to our team"}
              </div>
              <div className={"flex flex-col gap-4 items-center justify-center"} style={{ width: "300px" } as CSSProperties}>
                <a className={"tt-button flex justify-center items-center font-medium relative whitespace-nowrap font-sans cursor-pointer aria-button-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-busy:opacity-50 [&_svg]:shrink-0 gap-3 px-5 py-3 rounded-lg text-sm h-tt-large border border-solid shadow-[0_1px_2px_rgba(0,0,0,0.025)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] text-fg-default bg-[hsl(var(--button-default-bg))] border-border-default data-[hovered]:bg-[hsl(var(--button-default-bg-hover))] w-full"} tabIndex={0} target={"_blank"} href={"https://t.me/TokenTerminalHQ"}>
                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"}>
                    <path d={"M228.88,26.19a9,9,0,0,0-9.16-1.57L17.06,103.93a14.22,14.22,0,0,0,2.43,27.21L72,141.45V200a15.92,15.92,0,0,0,10,14.83,15.91,15.91,0,0,0,17.51-3.73l25.32-26.26L165,220a15.88,15.88,0,0,0,10.51,4,16.3,16.3,0,0,0,5-.79,15.85,15.85,0,0,0,10.67-11.63L231.77,35A9,9,0,0,0,228.88,26.19Zm-61.14,36L78.15,126.35l-49.6-9.73ZM88,200V152.52l24.79,21.74Zm87.53,8L92.85,135.5l119-85.29Z"} />
                  </svg>
                  {"Chat on Telegram"}
                </a>
                <a className={"tt-button flex justify-center items-center font-medium relative whitespace-nowrap font-sans cursor-pointer aria-button-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-busy:opacity-50 [&_svg]:shrink-0 gap-3 px-5 py-3 rounded-lg text-sm h-tt-large border border-solid shadow-[0_1px_2px_rgba(0,0,0,0.025)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] text-fg-default bg-[hsl(var(--button-default-bg))] border-border-default data-[hovered]:bg-[hsl(var(--button-default-bg-hover))] w-full"} tabIndex={0} target={"_blank"} href={"https://calendly.com/token-terminal/intro-call"}>
                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"}>
                    <path d={"M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Zm-96-88v64a8,8,0,0,1-16,0V132.94l-4.42,2.22a8,8,0,0,1-7.16-14.32l16-8A8,8,0,0,1,112,120Zm59.16,30.45L152,176h16a8,8,0,0,1,0,16H136a8,8,0,0,1-6.4-12.8l28.78-38.37A8,8,0,1,0,145.07,132a8,8,0,1,1-13.85-8A24,24,0,0,1,176,136,23.76,23.76,0,0,1,171.16,150.45Z"} />
                  </svg>
                  {"Book a demo"}
                </a>
                <a className={"tt-button flex justify-center items-center font-medium relative whitespace-nowrap font-sans cursor-pointer aria-button-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-busy:opacity-50 [&_svg]:shrink-0 gap-3 px-5 py-3 rounded-lg text-sm h-tt-large border border-solid shadow-[0_1px_2px_rgba(0,0,0,0.025)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] text-fg-default bg-[hsl(var(--button-default-bg))] border-border-default data-[hovered]:bg-[hsl(var(--button-default-bg-hover))] w-full"} tabIndex={0} target={"_blank"} href={"mailto:people@tokenterminal.xyz?subject=Contact Token Terminal"}>
                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"}>
                    <path d={"M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z"} />
                  </svg>
                  {"Email us"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
