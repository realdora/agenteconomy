import type { CSSProperties } from "react";

export function FooterSection() {
  return (
    <>
      <div className={"bg-white dark:bg-bg-surface text-fg-default py-5 px-5"}>
        <div className={"max-w-[1200px] mx-auto"}>
          <div className={"flex items-center justify-between gap-4 mb-5 py-3"}>
            <a className={"block"} href={"/"}>
              <svg xmlns={"http://www.w3.org/2000/svg"} viewBox={"0 0 157 17"} width={"157"} height={"18.406896551724138"} fill={"none"} className={"text-fg-default"}>
                <path fill={"currentColor"} d={"M8.44 13.68v2.37h-3.5a2.36 2.36 0 0 1-2.36-2.35V7.3H0V4.99h2.57V1.66h2.66v3.32h3.2v2.33h-3.2v6.37h3.2ZM9.55 10.76A5.5 5.5 0 0 1 15.2 5a5.5 5.5 0 0 1 5.64 5.76 5.5 5.5 0 0 1-5.64 5.75 5.5 5.5 0 0 1-5.65-5.75Zm8.63 0c0-2-1.28-3.32-2.98-3.32-1.71 0-3 1.32-3 3.32 0 1.99 1.29 3.32 3 3.32 1.7 0 2.98-1.33 2.98-3.32ZM25.36 10.23v5.82h-2.65V0h2.65v9.81L29.66 5h3.5L28.28 10l5.15 6.04h-3.32l-4.76-5.82Z"} />
                <path fill={"currentColor"} d={"M44.25 11.4h-8.32c.29 1.62 1.35 2.55 2.99 2.55 1.17 0 1.86-.44 2.21-1.22h2.88c-.66 2.3-2.59 3.54-5.2 3.54-3.16 0-5.49-2.37-5.49-5.75 0-3.39 2.33-5.76 5.49-5.76s5.5 2.37 5.5 5.76c-.01.3-.03.6-.06.88Zm-8.3-1.88h5.71c-.28-1.55-1.3-2.43-2.85-2.43s-2.57.88-2.86 2.43ZM48.82 16.05h-2.66V4.98h2.66v1.6a3.56 3.56 0 0 1 3.19-1.82c2.35 0 4.12 1.55 4.12 4.67v6.62h-2.66V9.96c0-1.85-.89-2.87-2.33-2.87-1.43 0-2.32 1.02-2.32 2.87v6.1ZM72.18 13.68v2.37h-3.5a2.36 2.36 0 0 1-2.36-2.35V7.3h-2.57V4.99h2.57V1.66h2.66v3.32h3.2v2.33h-3.2v6.37h3.2ZM84.28 11.4h-8.33c.29 1.62 1.35 2.55 3 2.55 1.16 0 1.85-.44 2.2-1.22h2.89c-.67 2.3-2.6 3.54-5.2 3.54-3.17 0-5.5-2.37-5.5-5.75 0-3.39 2.33-5.76 5.5-5.76 3.16 0 5.49 2.37 5.49 5.76 0 .3-.03.6-.05.88Zm-8.3-1.88h5.71c-.28-1.55-1.3-2.43-2.85-2.43-1.56 0-2.58.88-2.86 2.43ZM97.3 16.05h-2.65V4.98h2.66v1.44a3.37 3.37 0 0 1 2.96-1.66c1.5 0 2.77.69 3.41 2.04a3.72 3.72 0 0 1 3.46-2.04c2.23 0 3.9 1.49 3.9 4.45v6.84h-2.66v-6.3c0-1.73-.8-2.66-2.1-2.66-1.31 0-2.1.93-2.1 2.65v6.31h-2.67v-6.3c0-1.73-.8-2.66-2.1-2.66s-2.1.93-2.1 2.65v6.31ZM113.23 1.66c0-.95.71-1.66 1.66-1.66.98 0 1.66.71 1.66 1.66 0 .93-.68 1.66-1.66 1.66-.95 0-1.66-.73-1.66-1.66ZM116.22 4.98h-2.66v11.07h2.66V4.98ZM121.52 16.05h-2.66V4.98h2.66v1.6a3.56 3.56 0 0 1 3.18-1.82c2.35 0 4.12 1.55 4.12 4.67v6.62h-2.65V9.96c0-1.85-.89-2.87-2.33-2.87s-2.32 1.02-2.32 2.87v6.1ZM138.04 14.42c-.71 1.3-2 1.85-3.52 1.85-1.9 0-3.72-.95-3.72-3.18 0-4.76 7.2-2.64 7.2-4.85 0-.86-.89-1.38-2.04-1.38-1.22 0-2.06.65-2.06 1.89h-2.77c0-2.88 2.35-3.99 4.83-3.99 2.44 0 4.7 1 4.7 3.59v7.7h-2.62v-1.63Zm-2.97-.36c1.55 0 2.97-.88 2.97-2.57V11c-1.78.72-4.52.5-4.52 1.92 0 .78.66 1.15 1.55 1.15ZM143.07 16.05V0h2.66v16.05h-2.66ZM91.98 7.55h1.14V4.96h-.88c-1.36 0-2.66.66-3.38 1.81l-.02.03V5H86.2v11.08h2.65v-5.65c0-1.86 1.16-2.88 3.13-2.88h.01Z"} />
                <path fill={"#00CF9D"} d={"M148.14 16.05v-2.37H157v2.37h-8.86Z"} />
              </svg>
            </a>
            <a className={"tt-button flex justify-center items-center font-medium relative whitespace-nowrap font-sans cursor-pointer aria-button-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-busy:opacity-50 [&_svg]:shrink-0 gap-2 px-3.5 py-2 rounded-lg text-sm h-tt-regular border border-solid shadow-[0_1px_2px_rgba(0,0,0,0.025)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] text-fg-default bg-[hsl(var(--button-default-bg))] border-border-default data-[hovered]:bg-[hsl(var(--button-default-bg-hover))]"} tabIndex={0} target={"_blank"} href={"/explorer/listings"}>
              {"Get listed"}
            </a>
          </div>
          <div className={"flex flex-col md:flex-row gap-6 items-start"}>
            <div className={"flex flex-col w-[250px] shrink mb-6 md:mb-0"}>
              <div className={"text-[14px] font-medium mb-4"}>
                {"Company"}
              </div>
              <div className={"flex flex-col gap-1.5 items-start max-w-full"}>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"/about"}>
                  {"About"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"/careers"}>
                  {"Careers"}
                  <div data-color={"cyan"} data-size={"small"} data-variant={"muted"} className={"tt-badge"} style={{ marginLeft: "4px" } as CSSProperties}>
                    {"We're hiring!"}
                  </div>
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"/customers"}>
                  {"Customers"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"/contact"}>
                  {"Contact"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"/pricing"}>
                  {"Pricing"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"/privacy-policy"}>
                  {"Privacy policy"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"/terms"}>
                  {"Terms"}
                </a>
              </div>
            </div>
            <div className={"flex flex-col w-[250px] shrink mb-6 md:mb-0"}>
              <div className={"text-[14px] font-medium mb-4"}>
                {"Products"}
              </div>
              <div className={"flex flex-col gap-1.5 items-start max-w-full"}>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"/products/explorer"}>
                  {"Explorer"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"/products/studio"}>
                  {"Studio"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"/products/mcp"}>
                  {"MCP"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"/products/sheets"}>
                  {"Sheets"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"/products/api"}>
                  {"API"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"/products/data-room"}>
                  {"Data Room"}
                </a>
              </div>
            </div>
            <div className={"flex flex-col w-[250px] shrink mb-6 md:mb-0"}>
              <div className={"text-[14px] font-medium mb-4"}>
                {"Partnerships"}
              </div>
              <div className={"flex flex-col gap-1.5 items-start max-w-full"}>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"/products/data-partnerships"}>
                  {"Data Partnerships"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"/products/integrations"}>
                  {"Integrations"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"/products/indexes"}>
                  {"Indexes"}
                </a>
              </div>
            </div>
            <div className={"flex flex-col w-[250px] shrink mb-6 md:mb-0"}>
              <div className={"text-[14px] font-medium mb-4"}>
                {"Explore"}
              </div>
              <div className={"flex flex-col gap-1.5 items-start max-w-full"}>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"https://docs.tokenterminal.com/reference/api-reference"}>
                  {"API Docs"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"https://docs.tokenterminal.com/"}>
                  {"Docs"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"https://www.marketvector.com/indexes/digital-assets/marketvector-token-terminal-fundamental"}>
                  {"MVTT10F (index)"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"https://www.marketvector.com/indexes/digital-assets/marketvector-token-terminal-fundamental-cap-weighted-strategy"}>
                  {"MVTT10M (index)"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"https://tokenterminal.com/resources"}>
                  {"Resources"}
                </a>
              </div>
            </div>
            <div className={"flex flex-col w-[250px] shrink mb-6 md:mb-0"}>
              <div className={"text-[14px] font-medium mb-4"}>
                {"Socials"}
              </div>
              <div className={"flex flex-col gap-1.5 items-start max-w-full"}>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"https://x.com/tokenterminal"}>
                  {"X"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"https://discord.com/invite/tokenterminal"}>
                  {"Discord"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"https://www.linkedin.com/company/token-terminal"}>
                  {"LinkedIn"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"https://www.youtube.com/tokenterminal"}>
                  {"YouTube"}
                </a>
                <a className={"text-[14px] font-medium text-fg-secondary mb-[5px] no-underline hover:text-fg-default transition"} href={"https://tokenterminal.com/resources/interview"}>
                  {"Podcast"}
                </a>
              </div>
            </div>
          </div>
          <div>
            <div className={"border border-solid border-border-default bg-bg-surface p-7 rounded-2xl mt-6"}>
              <div className={"flex flex-col md:flex-row gap-4 items-center justify-between"}>
                <div className={"flex items-center gap-4"}>
                  <div className={"border border-solid border-border-default bg-bg-surface size-10 rounded-lg p-0 flex items-center justify-center"}>
                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"text-fg-secondary size-5"}>
                      <path d={"M104,152a8,8,0,0,1-8,8H56a8,8,0,0,1,0-16H96A8,8,0,0,1,104,152Zm136-36v60a16,16,0,0,1-16,16H136v32a8,8,0,0,1-16,0V192H32a16,16,0,0,1-16-16V116A60.07,60.07,0,0,1,76,56h76V24a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H168V56h12A60.07,60.07,0,0,1,240,116ZM120,176V116a44,44,0,0,0-88,0v60Zm104-60a44.05,44.05,0,0,0-44-44H168v72a8,8,0,0,1-16,0V72H116.75A59.86,59.86,0,0,1,136,116v60h88Z"} />
                    </svg>
                  </div>
                  <div className={"flex flex-col items-start"}>
                    <div data-level={"4"} className={"font-medium text-fg-default tracking-tighter text-lg"}>
                      {"Subscribe to our weekly newsletter"}
                    </div>
                    <div className={"text-sm text-fg-secondary"}>
                      {"Actionable insights you can’t get elsewhere."}
                    </div>
                  </div>
                </div>
                <div className={"flex gap-2 flex-col md:flex-row items-start relative w-[400px] max-w-full"}>
                  <label className={"w-full"}>
                    <div className={"sr-only"}>
                      {"Email"}
                    </div>
                    <div className={"tt-field-wrapper"} style={{ height: "38px", fontSize: "14px" } as CSSProperties} data-rac={""} data-required={"true"}>
                      <div data-size={"medium"} className={"tt-input-container"}>
                        <input type={"text"} required autoComplete={"off"} placeholder={"Enter your email"} tabIndex={0} id={"react-aria-:Rj7n6:"} aria-labelledby={"react-aria-:Rj7n6H1:"} aria-describedby={"react-aria-:Rj7n6H3: react-aria-:Rj7n6H4:"} className={"tt-input-base"} data-rac={""} defaultValue={""} />
                      </div>
                    </div>
                  </label>
                  <button className={"tt-button flex justify-center items-center font-medium relative whitespace-nowrap font-sans cursor-pointer aria-button-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-busy:opacity-50 [&_svg]:shrink-0 gap-2 px-3.5 py-2 rounded-lg text-sm h-tt-regular border border-solid shadow-[0_1px_2px_rgba(0,0,0,0.025)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] text-fg-default bg-[hsl(var(--button-default-bg))] border-border-default data-[hovered]:bg-[hsl(var(--button-default-bg-hover))]"} data-rac={""} type={"button"} tabIndex={0} data-react-aria-pressable={"true"} id={"react-aria-:R57n6:"}>
                    {"Subscribe"}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={"flex items-center justify-between gap-2 mt-9 mb-7"}>
            <div className={"text-left text-[#565656] text-[14px]"}>
              {"© "}
              {"2026"}
              {" Token Terminal"}
            </div>
            <div className={"tt-toggle-group pointer-events-auto"} data-size={"small"}>
              <button className={"tt-button flex justify-center items-center font-medium relative whitespace-nowrap font-sans cursor-pointer aria-button-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-busy:opacity-50 [&_svg]:shrink-0 gap-2 rounded-lg text-sm h-tt-regular border border-solid border-transparent bg-transparent shadow-none dark:shadow-none text-fg-default data-[hovered]:bg-neutral-950/5 dark:data-[hovered]:bg-neutral-300/10 tt-icon-button p-0 w-tt-regular h-tt-regular tt-toggle-group-icon-button"} data-rac={""} type={"button"} tabIndex={0} data-react-aria-pressable={"true"} aria-label={"Light"} id={"react-aria-:Rr9n6:"}>
                <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"pointer-events-none"} aria-hidden={"true"}>
                  <path d={"M120,40V16a8,8,0,0,1,16,0V40a8,8,0,0,1-16,0Zm72,88a64,64,0,1,1-64-64A64.07,64.07,0,0,1,192,128Zm-16,0a48,48,0,1,0-48,48A48.05,48.05,0,0,0,176,128ZM58.34,69.66A8,8,0,0,0,69.66,58.34l-16-16A8,8,0,0,0,42.34,53.66Zm0,116.68-16,16a8,8,0,0,0,11.32,11.32l16-16a8,8,0,0,0-11.32-11.32ZM192,72a8,8,0,0,0,5.66-2.34l16-16a8,8,0,0,0-11.32-11.32l-16,16A8,8,0,0,0,192,72Zm5.66,114.34a8,8,0,0,0-11.32,11.32l16,16a8,8,0,0,0,11.32-11.32ZM48,128a8,8,0,0,0-8-8H16a8,8,0,0,0,0,16H40A8,8,0,0,0,48,128Zm80,80a8,8,0,0,0-8,8v24a8,8,0,0,0,16,0V216A8,8,0,0,0,128,208Zm112-88H216a8,8,0,0,0,0,16h24a8,8,0,0,0,0-16Z"} />
                </svg>
              </button>
              <button className={"tt-button flex justify-center items-center font-medium relative whitespace-nowrap font-sans cursor-pointer aria-button-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-busy:opacity-50 [&_svg]:shrink-0 gap-2 rounded-lg text-sm h-tt-regular border border-solid shadow-[0_1px_2px_rgba(0,0,0,0.025)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] text-fg-default bg-[hsl(var(--button-default-bg))] border-border-default data-[hovered]:bg-[hsl(var(--button-default-bg-hover))] tt-icon-button p-0 w-tt-regular h-tt-regular tt-toggle-group-icon-button"} data-rac={""} type={"button"} tabIndex={0} data-react-aria-pressable={"true"} aria-label={"Dark"} id={"react-aria-:Rt9n6:"}>
                <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"pointer-events-none"} aria-hidden={"true"}>
                  <path d={"M233.54,142.23a8,8,0,0,0-8-2,88.08,88.08,0,0,1-109.8-109.8,8,8,0,0,0-10-10,104.84,104.84,0,0,0-52.91,37A104,104,0,0,0,136,224a103.09,103.09,0,0,0,62.52-20.88,104.84,104.84,0,0,0,37-52.91A8,8,0,0,0,233.54,142.23ZM188.9,190.34A88,88,0,0,1,65.66,67.11a89,89,0,0,1,31.4-26A106,106,0,0,0,96,56,104.11,104.11,0,0,0,200,160a106,106,0,0,0,14.92-1.06A89,89,0,0,1,188.9,190.34Z"} />
                </svg>
              </button>
              <button className={"tt-button flex justify-center items-center font-medium relative whitespace-nowrap font-sans cursor-pointer aria-button-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-busy:opacity-50 [&_svg]:shrink-0 gap-2 rounded-lg text-sm h-tt-regular border border-solid border-transparent bg-transparent shadow-none dark:shadow-none text-fg-default data-[hovered]:bg-neutral-950/5 dark:data-[hovered]:bg-neutral-300/10 tt-icon-button p-0 w-tt-regular h-tt-regular tt-toggle-group-icon-button"} data-rac={""} type={"button"} tabIndex={0} data-react-aria-pressable={"true"} aria-label={"System"} id={"react-aria-:Rv9n6:"}>
                <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"pointer-events-none"} aria-hidden={"true"}>
                  <path d={"M208,40H48A24,24,0,0,0,24,64V176a24,24,0,0,0,24,24H208a24,24,0,0,0,24-24V64A24,24,0,0,0,208,40Zm8,136a8,8,0,0,1-8,8H48a8,8,0,0,1-8-8V64a8,8,0,0,1,8-8H208a8,8,0,0,1,8,8Zm-48,48a8,8,0,0,1-8,8H96a8,8,0,0,1,0-16h64A8,8,0,0,1,168,224Z"} />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
