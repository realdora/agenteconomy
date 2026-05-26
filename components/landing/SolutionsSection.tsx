import type { CSSProperties } from "react";

export function SolutionsSection() {
  return (
    <>
      <div className={"text-[50px] md:pt-[120px] md:pb-[50px] lg:pt-[250px] lg:pb-[150px]"}>
        <div className={"w-[1240px] max-w-full mx-auto px-5"}>
          <div className={"flex flex-col gap-1 md:gap-4 max-w-full"}>
            <div className={"flex justify-between gap-4 md:gap-10 mb-10 flex-col md:flex-row items-start md:items-end"}>
              <div data-level={"1"} className={"font-medium text-fg-default tracking-tighter w-full md:max-w-none text-[36px] md:text-[46px] -mb-3.5"}>
                {"Solutions for every scale"}
              </div>
              <div className={"text-sm w-full md:w-[400px] text-fg-secondary"}>
                {"Our products drive technical and non-technical teams to success, building off the same quality data."}
              </div>
            </div>
            <div className={"flex flex-col gap-2"}>
              <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:flex xl:flex-row xl:justify-center gap-4 w-full ml-0 p-0 xl:px-5 xl:pb-5 xl:ml-[-20px] xl:w-[calc(100%+40px)]"}>
                <a className={"group h-[180px] md:h-[260px] w-full xl:max-w-[300px] rounded-2xl bg-bg-popover/80 relative border border-solid border-border-default overflow-hidden transition-background duration-200 hover:bg-neutral-100 dark:hover:bg-bg-popover p-5 pt-4 text-fg-default"} href={"/products/explorer"}>
                  <div className={"flex flex-col gap-2 h-full"} style={{ position: "relative" } as CSSProperties}>
                    <div className={"flex flex-col gap-0.5 h-[50px] md:h-[75px]"}>
                      <div className={"flex items-center justify-between"}>
                        <div className={"text-base font-medium"}>
                          {"Explorer"}
                        </div>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-4 h-4 shrink-0 text-fg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200"}>
                          <path d={"M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"} />
                        </svg>
                      </div>
                      <p className={"text-sm text-fg-secondary text-pretty"}>
                        {"Browse and compare"}
                      </p>
                    </div>
                    <div className={"relative flex-1"}>
                      <div className={"absolute top-0 left-0 w-full h-full"} style={{ maskImage: "radial-gradient(circle at top left, black 20%, transparent 95%)" } as CSSProperties} />
                    </div>
                  </div>
                  <div className={"h-[70%] opacity-85 md:h-full md:opacity-100 absolute bottom-0 right-0 w-full z-1 pointer-events-none bg-[linear-gradient(0deg,theme(colors.bg-surface)_0%,theme(colors.bg-surface/0)_100%)]"} />
                </a>
                <a className={"group h-[180px] md:h-[260px] w-full xl:max-w-[300px] rounded-2xl bg-bg-popover/80 relative border border-solid border-border-default overflow-hidden transition-background duration-200 hover:bg-neutral-100 dark:hover:bg-bg-popover p-5 pt-4 text-fg-default"} href={"/products/studio"}>
                  <div className={"flex flex-col gap-2 h-full"} style={{ position: "relative" } as CSSProperties}>
                    <div className={"flex flex-col gap-0.5 h-[50px] md:h-[75px]"}>
                      <div className={"flex items-center justify-between"}>
                        <div className={"text-base font-medium"}>
                          {"Studio"}
                        </div>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-4 h-4 shrink-0 text-fg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200"}>
                          <path d={"M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"} />
                        </svg>
                      </div>
                      <p className={"text-sm text-fg-secondary text-pretty"}>
                        {"Build and share"}
                      </p>
                    </div>
                    <div className={"relative flex-1"}>
                      <div className={"absolute top-0 left-0 w-full h-full"} style={{ maskImage: "radial-gradient(circle at top left, black 20%, transparent 95%)" } as CSSProperties} />
                    </div>
                  </div>
                  <div className={"h-[70%] opacity-85 md:h-full md:opacity-100 absolute bottom-0 right-0 w-full z-1 pointer-events-none bg-[linear-gradient(0deg,theme(colors.bg-surface)_0%,theme(colors.bg-surface/0)_100%)]"} />
                </a>
                <a className={"group h-[180px] md:h-[260px] w-full xl:max-w-[300px] rounded-2xl bg-bg-popover/80 relative border border-solid border-border-default overflow-hidden transition-background duration-200 hover:bg-neutral-100 dark:hover:bg-bg-popover p-5 pt-4 text-fg-default"} href={"/products/mcp"}>
                  <div className={"flex flex-col gap-2 h-full"} style={{ position: "relative" } as CSSProperties}>
                    <div className={"flex flex-col gap-0.5 h-[50px] md:h-[75px]"}>
                      <div className={"flex items-center justify-between"}>
                        <div className={"text-base font-medium"}>
                          {"MCP"}
                        </div>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-4 h-4 shrink-0 text-fg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200"}>
                          <path d={"M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"} />
                        </svg>
                      </div>
                      <p className={"text-sm text-fg-secondary text-pretty"}>
                        {"For AI & LLM applications"}
                      </p>
                    </div>
                    <div className={"relative flex-1"}>
                      <div className={"absolute top-0 left-0 w-full h-full"} style={{ maskImage: "radial-gradient(circle at top left, black 20%, transparent 95%)" } as CSSProperties} />
                    </div>
                  </div>
                  <div className={"h-[70%] opacity-85 md:h-full md:opacity-100 absolute bottom-0 right-0 w-full z-1 pointer-events-none bg-[linear-gradient(0deg,theme(colors.bg-surface)_0%,theme(colors.bg-surface/0)_100%)]"} />
                </a>
                <a className={"group h-[180px] md:h-[260px] w-full xl:max-w-[300px] rounded-2xl bg-bg-popover/80 relative border border-solid border-border-default overflow-hidden transition-background duration-200 hover:bg-neutral-100 dark:hover:bg-bg-popover p-5 pt-4 text-fg-default"} href={"/products/sheets"}>
                  <div className={"flex flex-col gap-2 h-full"} style={{ position: "relative" } as CSSProperties}>
                    <div className={"flex flex-col gap-0.5 h-[50px] md:h-[75px]"}>
                      <div className={"flex items-center justify-between"}>
                        <div className={"text-base font-medium"}>
                          {"Sheets"}
                        </div>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-4 h-4 shrink-0 text-fg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200"}>
                          <path d={"M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"} />
                        </svg>
                      </div>
                      <p className={"text-sm text-fg-secondary text-pretty"}>
                        {"For analysts & researchers"}
                      </p>
                    </div>
                    <div className={"relative flex-1"}>
                      <div className={"absolute top-0 left-0 w-full h-full"} style={{ maskImage: "radial-gradient(circle at top left, black 20%, transparent 95%)" } as CSSProperties} />
                    </div>
                  </div>
                  <div className={"h-[70%] opacity-85 md:h-full md:opacity-100 absolute bottom-0 right-0 w-full z-1 pointer-events-none bg-[linear-gradient(0deg,theme(colors.bg-surface)_0%,theme(colors.bg-surface/0)_100%)]"} />
                </a>
                <a className={"group h-[180px] md:h-[260px] w-full xl:max-w-[300px] rounded-2xl bg-bg-popover/80 relative border border-solid border-border-default overflow-hidden transition-background duration-200 hover:bg-neutral-100 dark:hover:bg-bg-popover p-5 pt-4 text-fg-default"} href={"/products/api"}>
                  <div className={"flex flex-col gap-2 h-full"} style={{ position: "relative" } as CSSProperties}>
                    <div className={"flex flex-col gap-0.5 h-[50px] md:h-[75px]"}>
                      <div className={"flex items-center justify-between"}>
                        <div className={"text-base font-medium"}>
                          {"API"}
                        </div>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-4 h-4 shrink-0 text-fg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200"}>
                          <path d={"M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"} />
                        </svg>
                      </div>
                      <p className={"text-sm text-fg-secondary text-pretty"}>
                        {"For data scientists & developers"}
                      </p>
                    </div>
                    <div className={"relative flex-1"}>
                      <div className={"absolute top-0 left-0 w-full h-full"} style={{ maskImage: "radial-gradient(circle at top left, black 20%, transparent 95%)" } as CSSProperties} />
                    </div>
                  </div>
                  <div className={"h-[70%] opacity-85 md:h-full md:opacity-100 absolute bottom-0 right-0 w-full z-1 pointer-events-none bg-[linear-gradient(0deg,theme(colors.bg-surface)_0%,theme(colors.bg-surface/0)_100%)]"} />
                </a>
                <a className={"group h-[180px] md:h-[260px] w-full xl:max-w-[300px] rounded-2xl bg-bg-popover/80 relative border border-solid border-border-default overflow-hidden transition-background duration-200 hover:bg-neutral-100 dark:hover:bg-bg-popover p-5 pt-4 text-fg-default"} href={"/products/data-room"}>
                  <div className={"flex flex-col gap-2 h-full"} style={{ position: "relative" } as CSSProperties}>
                    <div className={"flex flex-col gap-0.5 h-[50px] md:h-[75px]"}>
                      <div className={"flex items-center justify-between"}>
                        <div className={"text-base font-medium"}>
                          {"Data Room"}
                        </div>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-4 h-4 shrink-0 text-fg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200"}>
                          <path d={"M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"} />
                        </svg>
                      </div>
                      <p className={"text-sm text-fg-secondary text-pretty"}>
                        {"For technical teams"}
                      </p>
                    </div>
                    <div className={"relative flex-1"}>
                      <div className={"absolute top-0 left-0 w-full h-full"} style={{ maskImage: "radial-gradient(circle at top left, black 20%, transparent 95%)" } as CSSProperties} />
                    </div>
                  </div>
                  <div className={"h-[70%] opacity-85 md:h-full md:opacity-100 absolute bottom-0 right-0 w-full z-1 pointer-events-none bg-[linear-gradient(0deg,theme(colors.bg-surface)_0%,theme(colors.bg-surface/0)_100%)]"} />
                </a>
                <a className={"group h-[180px] md:h-[260px] w-full xl:max-w-[300px] rounded-2xl bg-bg-popover/80 relative border border-solid border-border-default overflow-hidden transition-background duration-200 hover:bg-neutral-100 dark:hover:bg-bg-popover p-5 pt-4 text-fg-default"} href={"/products/research"}>
                  <div className={"flex flex-col gap-2 h-full"} style={{ position: "relative" } as CSSProperties}>
                    <div className={"flex flex-col gap-0.5 h-[50px] md:h-[75px]"}>
                      <div className={"flex items-center justify-between"}>
                        <div className={"text-base font-medium"}>
                          {"Research"}
                        </div>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-4 h-4 shrink-0 text-fg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200"}>
                          <path d={"M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"} />
                        </svg>
                      </div>
                      <p className={"text-sm text-fg-secondary text-pretty"}>
                        {"Custom research & data support"}
                      </p>
                    </div>
                    <div className={"relative flex-1"}>
                      <div className={"absolute top-0 left-0 w-full h-full"} style={{ maskImage: "radial-gradient(circle at top left, black 20%, transparent 95%)" } as CSSProperties} />
                    </div>
                  </div>
                  <div className={"h-[70%] opacity-85 md:h-full md:opacity-100 absolute bottom-0 right-0 w-full z-1 pointer-events-none bg-[linear-gradient(0deg,theme(colors.bg-surface)_0%,theme(colors.bg-surface/0)_100%)]"} />
                </a>
              </div>
              <div className={"flex flex-col gap-6"}>
                <div className={"flex items-center gap-3"}>
                  <div className={"h-px flex-1 bg-border-default"} />
                  <span className={"text-xs text-fg-secondary uppercase tracking-wider font-medium"}>
                    {"Partnerships"}
                  </span>
                  <div className={"h-px flex-1 bg-border-default"} />
                </div>
                <div className={"grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3"}>
                  <a className={"group flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-popover/80 border border-solid border-border-default transition-background duration-200 hover:bg-neutral-100 dark:hover:bg-bg-popover text-fg-default"} href={"/products/data-partnerships"}>
                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 shrink-0 text-fg-secondary"}>
                      <path d={"M254.3,107.91,228.78,56.85a16,16,0,0,0-21.47-7.15L182.44,62.13,130.05,48.27a8.14,8.14,0,0,0-4.1,0L73.56,62.13,48.69,49.7a16,16,0,0,0-21.47,7.15L1.7,107.9a16,16,0,0,0,7.15,21.47l27,13.51,55.49,39.63a8.06,8.06,0,0,0,2.71,1.25l64,16a8,8,0,0,0,7.6-2.1l55.07-55.08,26.42-13.21a16,16,0,0,0,7.15-21.46Zm-54.89,33.37L165,113.72a8,8,0,0,0-10.68.61C136.51,132.27,116.66,130,104,122L147.24,80h31.81l27.21,54.41ZM41.53,64,62,74.22,36.43,125.27,16,115.06Zm116,119.13L99.42,168.61l-49.2-35.14,28-56L128,64.28l9.8,2.59-45,43.68-.08.09a16,16,0,0,0,2.72,24.81c20.56,13.13,45.37,11,64.91-5L188,152.66Zm62-57.87-25.52-51L214.47,64,240,115.06Zm-87.75,92.67a8,8,0,0,1-7.75,6.06,8.13,8.13,0,0,1-1.95-.24L80.41,213.33a7.89,7.89,0,0,1-2.71-1.25L51.35,193.26a8,8,0,0,1,9.3-13l25.11,17.94L126,208.24A8,8,0,0,1,131.82,217.94Z"} />
                    </svg>
                    <div className={"flex flex-col gap-0.5 flex-1"}>
                      <span className={"text-sm font-medium"}>
                        {"Data Partnerships"}
                      </span>
                      <span className={"text-xs text-fg-secondary"}>
                        {"Protocols & dApps"}
                      </span>
                    </div>
                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-4 h-4 shrink-0 text-fg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200"}>
                      <path d={"M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"} />
                    </svg>
                  </a>
                  <a className={"group flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-popover/80 border border-solid border-border-default transition-background duration-200 hover:bg-neutral-100 dark:hover:bg-bg-popover text-fg-default"} href={"/products/integrations"}>
                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 shrink-0 text-fg-secondary"}>
                      <path d={"M237.66,66.34a8,8,0,0,0-11.32,0L192,100.69,155.31,64l34.35-34.34a8,8,0,1,0-11.32-11.32L144,52.69,117.66,26.34a8,8,0,0,0-11.32,11.32L112.69,44l-53,53a40,40,0,0,0,0,56.57l15.71,15.71L26.34,218.34a8,8,0,0,0,11.32,11.32l49.09-49.09,15.71,15.71a40,40,0,0,0,56.57,0l53-53,6.34,6.35a8,8,0,0,0,11.32-11.32L203.31,112l34.35-34.34A8,8,0,0,0,237.66,66.34ZM147.72,185a24,24,0,0,1-33.95,0L71,142.23a24,24,0,0,1,0-33.95l53-53L200.69,132Z"} />
                    </svg>
                    <div className={"flex flex-col gap-0.5 flex-1"}>
                      <span className={"text-sm font-medium"}>
                        {"Integrations"}
                      </span>
                      <span className={"text-xs text-fg-secondary"}>
                        {"Third-party platforms"}
                      </span>
                    </div>
                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-4 h-4 shrink-0 text-fg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200"}>
                      <path d={"M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"} />
                    </svg>
                  </a>
                  <a className={"group flex items-center gap-3 px-4 py-3 rounded-xl bg-bg-popover/80 border border-solid border-border-default transition-background duration-200 hover:bg-neutral-100 dark:hover:bg-bg-popover text-fg-default"} href={"/products/indexes"}>
                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 shrink-0 text-fg-secondary"}>
                      <path d={"M224,200h-8V40a8,8,0,0,0-8-8H152a8,8,0,0,0-8,8V80H96a8,8,0,0,0-8,8v40H48a8,8,0,0,0-8,8v64H32a8,8,0,0,0,0,16H224a8,8,0,0,0,0-16ZM160,48h40V200H160ZM104,96h40V200H104ZM56,144H88v56H56Z"} />
                    </svg>
                    <div className={"flex flex-col gap-0.5 flex-1"}>
                      <span className={"text-sm font-medium"}>
                        {"Indexes"}
                      </span>
                      <span className={"text-xs text-fg-secondary"}>
                        {"Fundamentals-weighted"}
                      </span>
                    </div>
                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-4 h-4 shrink-0 text-fg-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-200"}>
                      <path d={"M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"} />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
