import type { CSSProperties } from "react";

export function AnnouncementSection() {
  return (
    <>
      <div className={"w-[1240px] max-w-full mx-auto px-5"}>
        <div className={"flex justify-center items-start gap-2 pt-4 md:pt-8 pb-10 md:pb-20 w-full"}>
          <a href={"https://tokenterminal.com/resources/newsletter/token-terminal-mcp-is-here"} target={"_blank"} rel={"noreferrer noopener"} className={"w-full md:w-auto animate-fade-in outline-none rounded-2xl focus-visible:outline-sky-500 focus-visible:outline-[2px] focus-visible:outline-offset-2"}>
            <div data-color={"neutral"} data-size={"large"} data-variant={"muted"} className={"tt-badge flex md:hidden rounded-3xl justify-center"}>
              <div className={"flex flex-col gap-1.5 p-1 w-full"}>
                <div className={"flex items-center justify-between w-full"}>
                  <div className={"flex flex-col"}>
                    <div className={"flex items-center gap-1.5"}>
                      <svg xmlns={"http://www.w3.org/2000/svg"} width={"12"} height={"12"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"shrink-0"}>
                        <path d={"M248,120a48.05,48.05,0,0,0-48-48H160.2c-2.91-.17-53.62-3.74-101.91-44.24A16,16,0,0,0,32,40V200a16,16,0,0,0,26.29,12.25c37.77-31.68,77-40.76,93.71-43.3v31.72A16,16,0,0,0,159.12,214l11,7.33A16,16,0,0,0,194.5,212l11.77-44.36A48.07,48.07,0,0,0,248,120ZM48,199.93V40h0c42.81,35.91,86.63,45,104,47.24v65.48C134.65,155,90.84,164.07,48,199.93Zm131,8,0,.11-11-7.33V168h21.6ZM200,152H168V88h32a32,32,0,1,1,0,64Z"} />
                      </svg>
                      <span className={"text-xs"}>
                        {"Announcement"}
                      </span>
                    </div>
                  </div>
                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"12"} height={"12"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"shrink-0"}>
                    <path d={"M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"} />
                  </svg>
                </div>
                <span className={"text-sm font-normal text-pretty"}>
                  {"Token Terminal MCP is here"}
                </span>
              </div>
            </div>
            <div data-color={"neutral"} data-size={"large"} data-variant={"muted"} className={"tt-badge hidden md:flex rounded-3xl justify-center group"}>
              <div className={"flex justify-between gap-2 items-center p-1"}>
                <div className={"flex items-center gap-2"}>
                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"shrink-0"}>
                    <path d={"M248,120a48.05,48.05,0,0,0-48-48H160.2c-2.91-.17-53.62-3.74-101.91-44.24A16,16,0,0,0,32,40V200a16,16,0,0,0,26.29,12.25c37.77-31.68,77-40.76,93.71-43.3v31.72A16,16,0,0,0,159.12,214l11,7.33A16,16,0,0,0,194.5,212l11.77-44.36A48.07,48.07,0,0,0,248,120ZM48,199.93V40h0c42.81,35.91,86.63,45,104,47.24v65.48C134.65,155,90.84,164.07,48,199.93Zm131,8,0,.11-11-7.33V168h21.6ZM200,152H168V88h32a32,32,0,1,1,0,64Z"} />
                  </svg>
                  <span className={"text-sm"}>
                    {"Announcement"}
                  </span>
                </div>
                <div role={"separator"} aria-orientation={"vertical"} aria-hidden={"true"} data-orientation={"vertical"} data-variant={"primary"} className={"data-[orientation=horizontal]:h-px bg-border-default data-[orientation=vertical]:h-auto data-[orientation=vertical]:self-stretch data-[orientation=vertical]:w-px data-[variant=secondary]:bg-[--border-secondary]"} />
                <span className={"text-sm font-normal"}>
                  {"Token Terminal MCP is here"}
                </span>
                <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"shrink-0 -translate-x-px group-hover:translate-x-px transition-transform duration-300"}>
                  <path d={"M221.66,133.66l-72,72a8,8,0,0,1-11.32-11.32L196.69,136H40a8,8,0,0,1,0-16H196.69L138.34,61.66a8,8,0,0,1,11.32-11.32l72,72A8,8,0,0,1,221.66,133.66Z"} />
                </svg>
              </div>
            </div>
          </a>
        </div>
      </div>
    </>
  );
}
