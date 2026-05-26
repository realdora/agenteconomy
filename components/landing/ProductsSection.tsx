import type { CSSProperties } from "react";

export function ProductsSection() {
  return (
    <>
      <div className={"w-[1240px] max-w-full mx-auto px-5"}>
        <div className={"w-full overflow-hidden py-20"}>
          <div className={"max-w-[1240px] mx-auto mb-12"}>
            <div data-level={"2"} className={"font-medium text-fg-default tracking-tighter text-center text-[32px] leading-[0.9em] lg:text-[40px] md:max-w-[550px] mx-auto"}>
              {"Onchain fundamentals"}
              <br />
              {"you can understand"}
            </div>
          </div>
          <div className={"relative w-full"}>
            <div className={"max-w-[1400px] mx-auto"}>
              <div className={"hidden lg:grid grid-cols-3 gap-6"}>
                <div className={"col-span-2"}>
                  <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col md:flex-row gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "450px" } as CSSProperties} href={"/products/explorer"}>
                    <div className={"flex-shrink-0 w-full md:w-[40%] flex flex-col"}>
                      <div className={"relative"}>
                        <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                            <path d={"M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"} />
                          </svg>
                        </div>
                        <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                          {"Explorer"}
                        </span>
                        <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                          {"Historical onchain metrics"}
                        </h4>
                        <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                          {"Track blockchain fees, revenue, and other key metrics over time with interactive charts that let you compare performance across projects and chains."}
                        </p>
                      </div>
                    </div>
                    <div className={"relative flex-1 min-h-0 mt-0 md:mt-5"}>
                      <div style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                        <div className={"bg-bg-surface border border-solid border-border-default rounded-tl-xl p-5 w-[800px]"}>
                          <div className={"pb-2"}>
                            <h3 className={"text-sm font-medium text-fg-default"}>
                              {"Fees for L1 blockchains"}
                            </h3>
                          </div>
                          <div className={"flex-1 w-full min-h-0 h-[420px]"} />
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"col-span-1"}>
                  <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "450px" } as CSSProperties} href={"/products/explorer"}>
                    <div className={"flex flex-col"}>
                      <div className={"relative"}>
                        <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                            <path d={"M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"} />
                          </svg>
                        </div>
                        <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                          {"Explorer"}
                        </span>
                        <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                          {"Tokenized assets"}
                        </h4>
                        <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                          {"Compare the top-performing tokenized assets with standardized metrics like market cap, trading volume, and price changes to identify market trends."}
                        </p>
                      </div>
                    </div>
                    <div className={"relative flex-1 min-h-0"}>
                      <div className={"relative bg-bg-surface border-t border-l border-solid border-border-default rounded-tl-xl flex-1 min-h-0 pt-6 pl-6 flex flex-col overflow-hidden"} style={{ maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                        <div className={"pb-3 flex justify-between items-center shrink-0"}>
                          <h3 className={"text-sm font-medium text-fg-default"}>
                            {"Circulating asset market cap"}
                          </h3>
                          <span className={"text-xs text-fg-tertiary pr-3"}>
                            {"30d"}
                          </span>
                        </div>
                        <div className={"pr-4 flex-1 min-h-0 overflow-hidden"}>
                          <div className={"flex flex-col flex-1 justify-between"}>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"col-span-1"}>
                  <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "500px" } as CSSProperties} href={"/products/explorer"}>
                    <div className={"flex flex-col"}>
                      <div className={"relative"}>
                        <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                            <path d={"M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"} />
                          </svg>
                        </div>
                        <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                          {"Explorer"}
                        </span>
                        <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                          {"Market sectors"}
                        </h4>
                        <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                          {"Visualize how fees and revenue are distributed across market sectors like stablecoins, L1 blockchains, exchanges, and more."}
                        </p>
                      </div>
                    </div>
                    <div className={"relative flex-1 min-h-0"}>
                      <div className={"relative bg-bg-surface border-t border-l border-solid border-border-default rounded-tl-xl flex-1 min-h-0 pt-3 pl-4"} style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                        <div className={"pb-3 shrink-0"}>
                          <h3 className={"text-sm font-medium text-fg-default"}>
                            {"Fees by market sector"}
                          </h3>
                        </div>
                        <div className={"pr-2.5 pb-2 flex-1 min-h-0 h-[250px] w-[600px]"}>
                          <div className={"flex gap-1.5 h-full"}>
                            <div className={"flex-[1.8] min-w-0"}>
                              <div className={"h-full bg-[hsl(var(--chart-1)/0.15)] rounded-lg p-1.5 flex flex-col"}>
                                <div className={"flex items-center gap-1.5 px-1 shrink-0"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"12"} height={"12"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"text-fg-default/50"}>
                                    <path fillRule={"evenodd"} clipRule={"evenodd"} d={"M102.203 103.359C106.395 103.112 110.596 103.693 114.564 105.067L161.839 121.345C168.861 123.762 174.635 128.87 177.89 135.545C181.145 142.219 181.616 149.913 179.199 156.934C178.487 159.003 177.538 160.963 176.387 162.782L219.129 167.31C222.815 167.586 226.394 168.686 229.597 170.535C232.875 172.427 235.673 175.049 237.772 178.197C239.871 181.346 241.218 184.936 241.704 188.688C242.159 192.207 241.848 195.78 240.796 199.162L240.576 199.836L240.574 199.841L240.281 200.645C238.751 204.637 236.204 208.167 232.887 210.88C229.349 213.773 225.074 215.623 220.543 216.223C220.385 216.243 220.225 216.26 220.066 216.271L177.969 219.29C177.549 219.32 177.126 219.317 176.706 219.28L110.983 213.572C110.332 213.516 109.689 213.38 109.071 213.167L40.9928 189.726L10.7369 179.307C6.72468 177.926 3.42528 175.007 1.56506 171.193C-0.295058 167.379 -0.564427 162.983 0.817017 158.971L13.8405 121.149C15.2221 117.137 18.1409 113.839 21.9547 111.978C25.7687 110.118 30.1652 109.849 34.1774 111.23L61.3004 120.569L90.1119 106.517C93.8954 104.68 98.0041 103.607 102.203 103.359ZM109.337 120.187C107.35 119.498 105.246 119.207 103.147 119.331C101.048 119.455 98.993 119.992 97.1012 120.911L68.3141 134.951L53.7662 177.202L113.349 197.719L177.457 203.285L218.627 200.333C220.142 200.1 221.57 199.466 222.758 198.494C223.993 197.485 224.921 196.151 225.441 194.643L225.589 194.17C225.9 193.058 225.984 191.893 225.836 190.744C225.665 189.431 225.195 188.174 224.461 187.073C223.726 185.972 222.747 185.054 221.6 184.392C220.454 183.731 219.169 183.343 217.848 183.258C217.738 183.251 217.628 183.241 217.518 183.229L149.152 175.987C148.552 175.924 147.961 175.792 147.39 175.596L117.133 165.178C112.956 163.739 110.736 159.186 112.174 155.009C113.613 150.831 118.165 148.611 122.342 150.049L148.817 159.165C151.826 160.201 155.124 160 157.985 158.604C160.845 157.209 163.034 154.735 164.07 151.725C165.106 148.716 164.905 145.419 163.509 142.558C162.114 139.698 159.64 137.509 156.63 136.473L109.337 120.187ZM15.9459 164.18L38.6383 171.993L51.6598 134.172L28.9684 126.359L15.9459 164.18ZM150.331 26.6864C157.478 23.7456 165.384 23.1826 172.876 25.0819C180.367 26.9812 187.05 31.2416 191.933 37.2323C194.678 40.599 196.772 44.4118 198.142 48.4764C200.049 48.1645 202.005 47.9999 204 47.9999C223.882 47.9999 240 64.1177 240 83.9999C240 103.882 223.882 120 204 120C188.139 120 174.674 109.743 169.876 95.4999C165.628 96.1988 161.263 96.1354 156.989 95.2831C149.409 93.7716 142.517 89.8605 137.332 84.1288C132.147 78.3971 128.944 71.1487 128.197 63.4559C127.45 55.7631 129.2 48.0338 133.186 41.412C137.172 34.7904 143.183 29.6273 150.331 26.6864ZM204 63.9999C201.075 63.9999 198.296 64.6273 195.792 65.7557C195.566 65.8772 195.334 65.9879 195.096 66.0878C188.519 69.3634 184 76.1533 184 83.9999C184 95.0454 192.954 104 204 104C215.045 104 224 95.0456 224 83.9999C224 72.9542 215.045 63.9999 204 63.9999ZM168.944 40.5917C164.782 39.5365 160.39 39.8485 156.419 41.4823C152.448 43.1161 149.109 45.9852 146.894 49.6639C144.68 53.3426 143.708 57.6363 144.123 61.91C144.538 66.1837 146.316 70.2111 149.197 73.3954C152.077 76.5796 155.907 78.7529 160.118 79.5927C162.829 80.1333 165.606 80.101 168.277 79.5204C169.556 69.2158 175.189 60.2625 183.279 54.5585C182.541 51.937 181.272 49.4775 179.531 47.3417C176.818 44.0137 173.106 41.6469 168.944 40.5917Z"} />
                                  </svg>
                                  <span className={"text-xs text-fg-default/80 truncate"}>
                                    {"Stablecoin issuers"}
                                  </span>
                                </div>
                                <div className={"flex-1 grid grid-cols-2 gap-1 mt-1.5 min-h-0"}>
                                  <div className={"bg-[hsl(var(--chart-1)/0.35)] hover:bg-[hsl(var(--chart-1)/0.45)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden row-span-2"}>
                                    <div className={"mb-auto"}>
                                      <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                        <img alt={"Tether"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_4.png"} />
                                      </div>
                                    </div>
                                    <div className={"mt-auto pt-1"}>
                                      <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                        {"Tether"}
                                      </p>
                                      <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                        {"$417.9M"}
                                        {" ("}
                                        {"25.9"}
                                        {"%)"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={"bg-[hsl(var(--chart-1)/0.35)] hover:bg-[hsl(var(--chart-1)/0.45)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden "}>
                                    <div className={"mb-auto"}>
                                      <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                        <img alt={"Circle"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_10.png"} />
                                      </div>
                                    </div>
                                    <div className={"mt-auto pt-1"}>
                                      <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                        {"Circle"}
                                      </p>
                                      <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                        {"$197.1M"}
                                        {" ("}
                                        {"12.2"}
                                        {"%)"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={"flex gap-1"}>
                                    <div className={"bg-[hsl(var(--chart-1)/0.35)] hover:bg-[hsl(var(--chart-1)/0.45)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                      <div className={"mb-auto"}>
                                        <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                          <img alt={"Sky"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_13.png"} />
                                        </div>
                                      </div>
                                      <div className={"mt-auto pt-1"}>
                                        <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                          {"Sky"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className={"bg-[hsl(var(--chart-1)/0.35)] hover:bg-[hsl(var(--chart-1)/0.45)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                      <div className={"mb-auto"}>
                                        <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                          <img alt={"Ethena"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_8.png"} />
                                        </div>
                                      </div>
                                      <div className={"mt-auto pt-1"}>
                                        <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                          {"Ethena"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={"flex-[1.2] min-w-0"}>
                              <div className={"h-full bg-[hsl(var(--chart-2)/0.15)] rounded-lg p-1.5 flex flex-col"}>
                                <div className={"flex items-center gap-1.5 px-1 shrink-0"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"12"} height={"12"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"text-fg-default/50"}>
                                    <path d={"M223.68,66.15,135.68,18h0a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32h0l80.34,44L128,120,47.66,76ZM40,90l80,43.78v85.79L40,175.82Zm96,129.57V133.82L216,90v85.78Z"} />
                                  </svg>
                                  <span className={"text-xs text-fg-default/80 truncate"}>
                                    {"Blockchains (L1)"}
                                  </span>
                                </div>
                                <div className={"flex-1 flex flex-col gap-1 mt-1.5 min-h-0"}>
                                  <div className={"bg-[hsl(var(--chart-2)/0.30)] hover:bg-[hsl(var(--chart-2)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-[1.5]"}>
                                    <div className={"mb-auto"}>
                                      <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                        <img alt={"Tron"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo.png"} />
                                      </div>
                                    </div>
                                    <div className={"mt-auto pt-1"}>
                                      <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                        {"Tron"}
                                      </p>
                                      <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                        {"$207.8M"}
                                        {" ("}
                                        {"12.9"}
                                        {"%)"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={"bg-[hsl(var(--chart-2)/0.30)] hover:bg-[hsl(var(--chart-2)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                    <div className={"mb-auto"}>
                                      <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                        <img alt={"Zcash"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_1.png"} />
                                      </div>
                                    </div>
                                    <div className={"mt-auto pt-1"}>
                                      <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                        {"Zcash"}
                                      </p>
                                      <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                        {"$124.1M"}
                                        {" ("}
                                        {"7.7"}
                                        {"%)"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={"flex gap-1 flex-[0.6]"}>
                                    <div className={"bg-[hsl(var(--chart-2)/0.30)] hover:bg-[hsl(var(--chart-2)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                      <div className={"mb-auto"}>
                                        <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                          <img alt={"Solana"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_7.png"} />
                                        </div>
                                      </div>
                                      <div className={"mt-auto pt-1"}>
                                        <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                          {"Solana"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className={"bg-[hsl(var(--chart-2)/0.30)] rounded flex-1 flex items-center justify-center"}>
                                      <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "14px", height: "14px" } as CSSProperties}>
                                        <img alt={"BNB Chain"} loading={"lazy"} width={"14"} height={"14"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_5.png"} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={"flex-1 flex flex-col gap-1.5 min-w-0"}>
                              <div className={"flex-1"}>
                                <div className={"h-full bg-[hsl(var(--chart-3)/0.15)] rounded-lg p-1.5 flex flex-col"}>
                                  <div className={"flex items-center gap-1.5 px-1 shrink-0"}>
                                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"12"} height={"12"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"text-fg-default/50"}>
                                      <path d={"M213.66,181.66l-32,32a8,8,0,0,1-11.32-11.32L188.69,184H48a8,8,0,0,1,0-16H188.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,213.66,181.66Zm-139.32-64a8,8,0,0,0,11.32-11.32L67.31,88H208a8,8,0,0,0,0-16H67.31L85.66,53.66A8,8,0,0,0,74.34,42.34l-32,32a8,8,0,0,0,0,11.32Z"} />
                                    </svg>
                                    <span className={"text-xs text-fg-default/80 truncate"}>
                                      {"Exchanges (DEX)"}
                                    </span>
                                  </div>
                                  <div className={"flex-1 grid grid-cols-2 gap-1 mt-1.5 min-h-0"}>
                                    <div className={"bg-[hsl(var(--chart-3)/0.30)] hover:bg-[hsl(var(--chart-3)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden "}>
                                      <div className={"mb-auto"}>
                                        <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                          <img alt={"PancakeSwap"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_9.png"} />
                                        </div>
                                      </div>
                                      <div className={"mt-auto pt-1"}>
                                        <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                          {"PancakeSwap"}
                                        </p>
                                        <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                          {"$48.9M"}
                                          {" ("}
                                          {"3.0"}
                                          {"%)"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className={"flex flex-col gap-1"}>
                                      <div className={"bg-[hsl(var(--chart-3)/0.30)] hover:bg-[hsl(var(--chart-3)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                        <div className={"mb-auto"}>
                                          <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                            <img alt={"pump.fun"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_11.png"} />
                                          </div>
                                        </div>
                                        <div className={"mt-auto pt-1"}>
                                          <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                            {"pump.fun"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className={"bg-[hsl(var(--chart-3)/0.30)] hover:bg-[hsl(var(--chart-3)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                        <div className={"mb-auto"}>
                                          <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                            <img alt={"Uniswap"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_6.png"} />
                                          </div>
                                        </div>
                                        <div className={"mt-auto pt-1"}>
                                          <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                            {"Uniswap"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={"flex-1"}>
                                <div className={"h-full bg-[hsl(var(--chart-12)/0.15)] rounded-lg p-1.5 flex flex-col"}>
                                  <div className={"flex items-center gap-1.5 px-1 shrink-0"}>
                                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"12"} height={"12"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"text-fg-default/50"}>
                                      <path d={"M232,64H208V48a8,8,0,0,0-8-8H56a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8Zm144-8.9c0,35.52-29,64.64-64,64.9a64,64,0,0,1-64-64V56H192ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z"} />
                                    </svg>
                                    <span className={"text-xs text-fg-default/80 truncate"}>
                                      {"Liquid staking"}
                                    </span>
                                  </div>
                                  <div className={"flex-1 grid grid-cols-2 gap-1 mt-1.5 min-h-0"}>
                                    <div className={"bg-[hsl(var(--chart-12)/0.30)] hover:bg-[hsl(var(--chart-12)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden "}>
                                      <div className={"mb-auto"}>
                                        <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                          <img alt={"Lido Finance"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_3.png"} />
                                        </div>
                                      </div>
                                      <div className={"mt-auto pt-1"}>
                                        <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                          {"Lido Finance"}
                                        </p>
                                        <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                          {"$78.0M"}
                                          {" ("}
                                          {"4.8"}
                                          {"%)"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className={"flex flex-col gap-1"}>
                                      <div className={"bg-[hsl(var(--chart-12)/0.30)] hover:bg-[hsl(var(--chart-12)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                        <div className={"mb-auto"}>
                                          <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                            <img alt={"Jito"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_2.png"} />
                                          </div>
                                        </div>
                                        <div className={"mt-auto pt-1"}>
                                          <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                            {"Jito"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className={"bg-[hsl(var(--chart-12)/0.30)] hover:bg-[hsl(var(--chart-12)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                        <div className={"mb-auto"}>
                                          <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                            <img alt={"ether.fi"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_12.png"} />
                                          </div>
                                        </div>
                                        <div className={"mt-auto pt-1"}>
                                          <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                            {"ether.fi"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"col-span-1"}>
                  <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "500px" } as CSSProperties} href={"/products/explorer"}>
                    <div className={"flex flex-col"}>
                      <div className={"relative"}>
                        <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                            <path d={"M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"} />
                          </svg>
                        </div>
                        <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                          {"Explorer"}
                        </span>
                        <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                          {"Financial statements"}
                        </h4>
                        <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                          {"Analyze income statements with fees, revenue, expenses, and earnings for blockchain projects using traditional financial reporting formats."}
                        </p>
                      </div>
                    </div>
                    <div className={"relative flex-1 min-h-0"}>
                      <div className={"relative bg-bg-surface border-t border-l border-solid border-border-default rounded-tl-xl flex-1 min-h-0"} style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                        <div className={"overflow-x-hidden overflow-y-hidden relative w-full"}>
                          <div className={"w-full overflow-x-auto  relative"}>
                            <table data-density={"large"} data-row-border-radius={"none"} data-row-hover={"false"} data-row-style={"no-border"} data-last-row-border={"false"} className={"tt-table financial-statement-table w-full"} style={{ "--cell-font-size": "12px", "--cell-padding-x": "8px" } as CSSProperties}>
                              <thead className={"tt-table-header"}>
                                <tr className={"tt-table-row"}>
                                  <th className={"tt-table-header-cell min-w-[180px] sticky left-0 z-10 bg-bg-surface border-b border-solid border-border-default"}>
                                    <div className={"flex items-center gap-1.5"}>
                                      <img alt={"Ethereum"} loading={"lazy"} width={"14"} height={"14"} decoding={"async"} data-nimg={"1"} className={"w-3.5 h-3.5 rounded-full object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/ethereum.png"} />
                                      <span className={"text-sm text-fg-default"}>
                                        {"Ethereum"}
                                      </span>
                                    </div>
                                  </th>
                                  <th className={"tt-table-header-cell border-b border-solid border-border-default"} style={{ minWidth: "120px" } as CSSProperties}>
                                    <div className={"flex flex-col gap-0 leading-none items-end"}>
                                      <div className={"text-sm font-medium"}>
                                        {"Jan 2026"}
                                      </div>
                                    </div>
                                  </th>
                                  <th className={"tt-table-header-cell border-b border-solid border-border-default"} style={{ minWidth: "120px" } as CSSProperties}>
                                    <div className={"flex flex-col gap-0 leading-none items-end"}>
                                      <div className={"text-sm font-medium"}>
                                        {"Dec 2025"}
                                      </div>
                                    </div>
                                  </th>
                                  <th className={"tt-table-header-cell border-b border-solid border-border-default"} style={{ minWidth: "120px" } as CSSProperties}>
                                    <div className={"flex flex-col gap-0 leading-none items-end"}>
                                      <div className={"text-sm font-medium"}>
                                        {"Nov 2025"}
                                      </div>
                                    </div>
                                  </th>
                                  <th className={"tt-table-header-cell border-b border-solid border-border-default"} style={{ minWidth: "120px" } as CSSProperties}>
                                    <div className={"flex flex-col gap-0 leading-none items-end"}>
                                      <div className={"text-sm font-medium"}>
                                        {"Oct 2025"}
                                      </div>
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className={"tt-table-body"}>
                                <tr className={"tt-table-row"}>
                                  <td className={"tt-table-cell font-medium pt-3.5 pb-1 sticky left-0 z-10 bg-bg-surface"}>
                                    {"Income statement"}
                                  </td>
                                  <td className={"tt-table-cell pt-0 pb-1"} />
                                  <td className={"tt-table-cell pt-0 pb-1"} />
                                  <td className={"tt-table-cell pt-0 pb-1"} />
                                  <td className={"tt-table-cell pt-0 pb-1"} />
                                </tr>
                                <tr className={"tt-table-row group/metric-row"}>
                                  <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"text-fg-secondary "}>
                                      {"Fees"}
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"312.4M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"4.8"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"298.1M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-red"}>
                                          {"-"}
                                          {"2.1"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"287.6M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"4.5"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"275.2M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"3.2"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className={"tt-table-row group/metric-row"}>
                                  <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"text-fg-secondary "}>
                                      {"Revenue"}
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"312.4M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"4.8"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"298.1M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-red"}>
                                          {"-"}
                                          {"2.1"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"287.6M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"4.5"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"275.2M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"3.2"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className={"tt-table-row group/metric-row"}>
                                  <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"text-fg-secondary ml-3"}>
                                      {"(Expenses)"}
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"45.2M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"5.6"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"42.8M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"3.6"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"41.3M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"3.8"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"39.8M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"2.9"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className={"tt-table-row group/metric-row"}>
                                  <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)] border-t border-solid border-border-default"}>
                                    <div className={"text-fg-default "}>
                                      {"Earnings"}
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)] border-t border-solid border-border-default"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"267.2M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"4.7"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)] border-t border-solid border-border-default"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"255.3M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-red"}>
                                          {"-"}
                                          {"2.5"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)] border-t border-solid border-border-default"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"246.3M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"4.6"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)] border-t border-solid border-border-default"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"235.4M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"3.4"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className={"tt-table-row"}>
                                  <td className={"tt-table-cell px-0 pt-3.5 pb-1 sticky left-0 z-10 bg-bg-surface"}>
                                    <div className={"h-px border-t border-solid border-border-default"} />
                                  </td>
                                  <td className={"tt-table-cell px-0 pt-3.5 pb-1"} colSpan={4}>
                                    <div className={"h-px border-t border-solid border-border-default"} />
                                  </td>
                                </tr>
                                <tr className={"tt-table-row"}>
                                  <td className={"tt-table-cell font-medium pt-3.5 pb-1 sticky left-0 z-10 bg-bg-surface"}>
                                    {"Market data"}
                                  </td>
                                  <td className={"tt-table-cell pt-0 pb-1"} />
                                  <td className={"tt-table-cell pt-0 pb-1"} />
                                  <td className={"tt-table-cell pt-0 pb-1"} />
                                  <td className={"tt-table-cell pt-0 pb-1"} />
                                </tr>
                                <tr className={"tt-table-row group/metric-row"}>
                                  <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"text-fg-secondary "}>
                                      {"Price"}
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"3.4K"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"3.7"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"3.3K"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"4.5"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"3.2K"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"2.2"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"3.1K"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-red"}>
                                          {"-"}
                                          {"1.2"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className={"tt-table-row group/metric-row"}>
                                  <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"text-fg-secondary "}>
                                      {"Market cap (circulating)"}
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"411.2B"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"3.7"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"396.5B"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"4.5"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"379.4B"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"2.2"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"371.2B"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-red"}>
                                          {"-"}
                                          {"1.2"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"col-span-1"}>
                  <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "500px" } as CSSProperties} href={"/products/studio"}>
                    <div className={"flex flex-col"}>
                      <div className={"relative"}>
                        <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                            <path d={"M248,92.68a15.86,15.86,0,0,0-4.69-11.31L174.63,12.68a16,16,0,0,0-22.63,0L123.57,41.11l-58,21.77A16.06,16.06,0,0,0,55.35,75.23L32.11,214.68A8,8,0,0,0,40,224a8.4,8.4,0,0,0,1.32-.11l139.44-23.24a16,16,0,0,0,12.35-10.17l21.77-58L243.31,104A15.87,15.87,0,0,0,248,92.68Zm-69.87,92.19L63.32,204l47.37-47.37a28,28,0,1,0-11.32-11.32L52,192.7,71.13,77.86,126,57.29,198.7,130ZM112,132a12,12,0,1,1,12,12A12,12,0,0,1,112,132Zm96-15.32L139.31,48l24-24L232,92.68Z"} />
                          </svg>
                        </div>
                        <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                          {"Studio"}
                        </span>
                        <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                          {"Dive deeper with Queries"}
                        </h4>
                        <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                          {"Write and execute SQL queries against raw blockchain data with AI-powered suggestions and instant results."}
                        </p>
                      </div>
                    </div>
                    <div className={"relative flex-1 min-h-0"}>
                      <div className={"relative border-t border-l border-solid border-border-default rounded-tl-xl flex-1 min-h-0"} style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                        <div className={"bg-bg-default overflow-hidden"} style={{ width: "calc(100% + 150px)" } as CSSProperties}>
                          <div className={"flex items-center justify-between px-3 py-1.5 border-b border-border-default bg-bg-default"}>
                            <div className={"flex items-center gap-2 text-xs"}>
                              <span className={"text-fg-secondary"}>
                                {"Queries"}
                              </span>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5 text-fg-secondary"}>
                                <path d={"M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"} />
                              </svg>
                              <span className={"text-fg-default"}>
                                {"Bitcoin active_addresses"}
                              </span>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-fg-secondary"}>
                                <path d={"M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"} />
                              </svg>
                            </div>
                          </div>
                          <div className={"flex"}>
                            <div className={"w-[160px] shrink-0 border-r border-border-default bg-bg-default flex flex-col"}>
                              <div className={"h-[36px] px-3 flex items-center border-b border-border-default"}>
                                <button className={"flex items-center gap-1 text-xs text-fg-default font-medium py-1.5 border-b-2 border-fg-default -mb-[1px]"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3"}>
                                    <path d={"M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z"} />
                                  </svg>
                                  {"Tables"}
                                </button>
                              </div>
                              <div className={"p-2 flex flex-col gap-2"}>
                                <div className={"flex items-center gap-1.5 px-2 py-1.5 bg-bg-inset border border-border-default rounded"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-fg-secondary"}>
                                    <path d={"M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"} />
                                  </svg>
                                  <span className={"text-xs text-fg-secondary"}>
                                    {"Search"}
                                  </span>
                                </div>
                                <div className={"flex flex-col rounded overflow-hidden border border-border-default"}>
                                  <button className={"flex items-center gap-1 h-8 px-2 py-1.5 w-full text-left bg-bg-default hover:bg-neutral-100 dark:hover:bg-neutral-800 border-b border-border-default"}>
                                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-fg-secondary"}>
                                      <path d={"M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"} />
                                    </svg>
                                    <div className={"flex justify-center items-center h-4 w-4 rounded bg-neutral-500/10 dark:bg-neutral-500/30 text-fg-secondary"}>
                                      <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5"}>
                                        <path d={"M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"} />
                                      </svg>
                                    </div>
                                    <span className={"text-xs text-fg-default flex-1"}>
                                      {"metrics"}
                                    </span>
                                    <span className={"text-[10px] text-fg-secondary"}>
                                      {"2"}
                                    </span>
                                  </button>
                                  <button className={"flex items-center gap-1 h-8 px-2 py-1.5 w-full text-left bg-bg-default hover:bg-neutral-100 dark:hover:bg-neutral-800 "}>
                                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-fg-secondary"}>
                                      <path d={"M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"} />
                                    </svg>
                                    <div className={"flex justify-center items-center h-4 w-4 rounded bg-neutral-500/10 dark:bg-neutral-500/30 text-fg-secondary"}>
                                      <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5"}>
                                        <path d={"M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z"} />
                                      </svg>
                                    </div>
                                    <span className={"text-xs text-fg-default flex-1"}>
                                      {"primitives"}
                                    </span>
                                    <span className={"text-[10px] text-fg-secondary"}>
                                      {"2"}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className={"flex-1 flex flex-col min-w-0"}>
                              <div className={"m-3 border border-border-default rounded overflow-hidden bg-bg-inset"}>
                                <div className={"flex font-mono text-xs"}>
                                  <div className={"py-2 px-2 text-right text-fg-tertiary select-none border-r border-border-default bg-bg-default"}>
                                    <div>
                                      {"1"}
                                    </div>
                                    <div>
                                      {"2"}
                                    </div>
                                    <div>
                                      {"3"}
                                    </div>
                                  </div>
                                  <div className={"py-2 px-3 flex-1"}>
                                    <div>
                                      <span className={"text-[#C586C0]"}>
                                        {"select"}
                                      </span>
                                      <span className={"text-fg-default"}>
                                        {" *"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className={"text-[#C586C0]"}>
                                        {"from"}
                                      </span>
                                      <span className={"text-fg-default"}>
                                        {" metrics"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className={"text-[#C586C0]"}>
                                        {"where"}
                                      </span>
                                      <span className={"text-fg-default"}>
                                        {" data_id = "}
                                      </span>
                                      <span className={"text-[#CE9178]"}>
                                        {"'bitcoin'"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={"flex items-center justify-between px-3 pb-2 text-xs"}>
                                <div className={"flex items-center gap-1 text-fg-secondary"}>
                                  <span className={"px-1 py-0.5 bg-bg-inset border border-border-default rounded text-[10px] font-medium"}>
                                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5 inline"}>
                                      <path d={"M180,144H160V112h20a36,36,0,1,0-36-36V96H112V76a36,36,0,1,0-36,36H96v32H76a36,36,0,1,0,36,36V160h32v20a36,36,0,1,0,36-36ZM160,76a20,20,0,1,1,20,20H160ZM56,76a20,20,0,0,1,40,0V96H76A20,20,0,0,1,56,76ZM96,180a20,20,0,1,1-20-20H96Zm16-68h32v32H112Zm68,88a20,20,0,0,1-20-20V160h20a20,20,0,0,1,0,40Z"} />
                                    </svg>
                                    {"I"}
                                  </span>
                                  <span>
                                    {"AI suggestions"}
                                  </span>
                                </div>
                                <button className={"px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"}>
                                  {"Run query"}
                                </button>
                              </div>
                              <div className={"flex items-center gap-2 px-3 py-2 border-t border-border-default text-xs"}>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3"} style={{ color: "#1AFFAB" } as CSSProperties}>
                                  <path d={"M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"} />
                                </svg>
                                <span className={"text-fg-default font-medium"}>
                                  {"Success"}
                                </span>
                                <span className={"text-fg-secondary"}>
                                  {"21 days ago"}
                                </span>
                              </div>
                              <div className={"border-t border-border-default"}>
                                <table className={"w-full text-xs"}>
                                  <thead>
                                    <tr className={"border-b border-border-default bg-bg-default"}>
                                      <th className={"px-3 py-1.5 text-left font-normal text-fg-default"}>
                                        {"timestamp"}
                                      </th>
                                      <th className={"px-3 py-1.5 text-left font-normal text-fg-default"}>
                                        {"data_id"}
                                      </th>
                                      <th className={"px-3 py-1.5 text-left font-normal text-fg-default"}>
                                        {"value"}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className={"border-b border-border-default"}>
                                      <td className={"px-3 py-1.5 text-fg-default"}>
                                        {"5/1/2012"}
                                      </td>
                                      <td className={"px-3 py-1.5 text-fg-default"}>
                                        {"bitcoin"}
                                      </td>
                                      <td className={"px-3 py-1.5 text-fg-default tabular-nums"}>
                                        {"11,443"}
                                      </td>
                                    </tr>
                                    <tr className={"border-b border-border-default"}>
                                      <td className={"px-3 py-1.5 text-fg-default"}>
                                        {"5/2/2012"}
                                      </td>
                                      <td className={"px-3 py-1.5 text-fg-default"}>
                                        {"bitcoin"}
                                      </td>
                                      <td className={"px-3 py-1.5 text-fg-default tabular-nums"}>
                                        {"11,573"}
                                      </td>
                                    </tr>
                                    <tr className={"border-b border-border-default"}>
                                      <td className={"px-3 py-1.5 text-fg-default"}>
                                        {"5/5/2012"}
                                      </td>
                                      <td className={"px-3 py-1.5 text-fg-default"}>
                                        {"bitcoin"}
                                      </td>
                                      <td className={"px-3 py-1.5 text-fg-default tabular-nums"}>
                                        {"12,299"}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"col-span-1"}>
                  <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "500px" } as CSSProperties} href={"/products/sheets"}>
                    <div className={"flex flex-col"}>
                      <div className={"relative"}>
                        <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                            <path d={"M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z"} />
                          </svg>
                        </div>
                        <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                          {"Sheets"}
                        </span>
                        <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                          {"Sheets integration"}
                        </h4>
                        <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                          {"Pull blockchain data directly into Excel and Google Sheets with custom functions for financial statements, metrics, and more."}
                        </p>
                      </div>
                    </div>
                    <div className={"relative flex-1 min-h-0"}>
                      <div className={"relative border-t border-l border-solid border-border-default rounded-tl-xl flex-1 min-h-0"} style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                        <div className={"bg-bg-default"} style={{ width: "calc(100% + 100px)" } as CSSProperties}>
                          <div className={"flex items-center gap-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"}>
                            <div className={"flex items-center gap-1 px-2 py-1.5 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800"}>
                              <input type={"text"} readOnly className={"w-10 text-xs font-medium text-fg-default bg-transparent border-none outline-none cursor-pointer"} defaultValue={"A1"} />
                              <button className={"text-fg-secondary hover:text-fg-default"}>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3"}>
                                  <path d={"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"} />
                                </svg>
                              </button>
                            </div>
                            <div className={"flex-1 flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-950"}>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-4 h-4 text-fg-secondary"}>
                                <path d={"M208,40a8,8,0,0,1-8,8H170.71a24,24,0,0,0-23.62,19.71L137.59,120H184a8,8,0,0,1,0,16H134.68l-10,55.16A40,40,0,0,1,85.29,224H56a8,8,0,0,1,0-16H85.29a24,24,0,0,0,23.62-19.71l9.5-52.29H72a8,8,0,0,1,0-16h49.32l10-55.16A40,40,0,0,1,170.71,32H200A8,8,0,0,1,208,40Z"} />
                              </svg>
                              <div className={"flex-1 font-mono text-xs"}>
                                <span className={"text-fg-default"}>
                                  {"=TT_FINANCIAL_STATEMENT("}
                                </span>
                                <span className={"text-green-600 dark:text-green-400"}>
                                  {"\"ETH\""}
                                </span>
                                <span className={"text-fg-default"}>
                                  {", "}
                                </span>
                                <span className={"text-green-600 dark:text-green-400"}>
                                  {"\"quarter\""}
                                </span>
                                <span className={"text-fg-default"}>
                                  {")"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={"flex"}>
                            <div className={"w-8 shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"}>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div style={{ height: "24px" } as CSSProperties} />
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-200 dark:bg-neutral-800"} style={{ height: "24px" } as CSSProperties}>
                                  {"1"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"2"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"3"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"4"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"5"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"6"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"7"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"8"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"9"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"10"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"11"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"12"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"13"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"14"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"15"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"16"}
                                </div>
                              </div>
                            </div>
                            <div className={"flex-1"}>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center justify-center text-xs border-r border-neutral-200 dark:border-neutral-800 bg-blue-100 dark:bg-blue-900/30"} style={{ height: "24px" } as CSSProperties}>
                                  {"A"}
                                </div>
                                <div className={"w-24 shrink-0 flex items-center justify-center text-xs border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"} style={{ height: "24px" } as CSSProperties}>
                                  {"B"}
                                </div>
                                <div className={"w-24 shrink-0 flex items-center justify-center text-xs border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"} style={{ height: "24px" } as CSSProperties}>
                                  {"C"}
                                </div>
                                <div className={"w-24 shrink-0 flex items-center justify-center text-xs border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"} style={{ height: "24px" } as CSSProperties}>
                                  {"D"}
                                </div>
                                <div className={"w-24 shrink-0 flex items-center justify-center text-xs border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"} style={{ height: "24px" } as CSSProperties}>
                                  {"E"}
                                </div>
                              </div>
                              <div className={"flex flex-col"}>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-blue-50 dark:bg-blue-950/20 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <div className={"absolute inset-0 border-2 border-blue-500 pointer-events-none z-10"} />
                                    <div className={"absolute bottom-0 right-0 w-2 h-2 bg-blue-500 cursor-nwse-resize z-10"} />
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Quarters"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Q1 2026"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Q4 2025"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Q3 2025"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Q2 2025"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Income Statement"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties} />
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties} />
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties} />
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties} />
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Fees"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$4,716,702.18"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$76,566,498.54"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$125,341,114.86"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$103,303,663.73"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Fees_Supply_Side"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$4,010,677.26"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$48,093,226.99"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$69,046,943.74"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$52,989,953.17"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Revenue"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$706,024.92"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$28,473,271.56"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$56,294,171.12"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$50,313,710.56"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Expenses"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$97,171,161.57"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$765,529,137.32"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$933,698,411.71"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$528,485,214.55"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Token_Incentives"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$97,171,161.57"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$765,529,137.32"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$933,698,411.71"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$528,485,214.55"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Earnings"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($96,465,136.64)"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($737,055,865.7)"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($877,404,240.5)"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($478,171,503.9)"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Operating_Expenses"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$12,450,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$45,200,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$52,800,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$38,500,000.00"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Research_Development"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$8,200,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$28,500,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$32,000,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$22,000,000.00"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Sales_Marketing"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$2,850,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$10,200,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$12,500,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$9,800,000.00"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"General_Administrative"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$1,400,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$6,500,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$8,300,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$6,700,000.00"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Operating_Income"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($11,743,975.08)"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($16,726,728.44)"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$3,494,171.12"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$11,813,710.56"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Other_Income"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$125,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$850,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$1,200,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$650,000.00"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Interest_Expense"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$0.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$0.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$0.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$0.00"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Net_Income"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($96,340,136.64)"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($736,205,865.7)"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($876,204,240.5)"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($477,521,503.9)"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"col-span-1"}>
                  <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "500px" } as CSSProperties} href={"/products/api"}>
                    <div className={"flex flex-col"}>
                      <div className={"relative"}>
                        <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                            <path d={"M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"} />
                          </svg>
                        </div>
                        <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                          {"API"}
                        </span>
                        <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                          {"REST API"}
                        </h4>
                        <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                          {"Access standardized blockchain metrics through a developer-friendly REST API with comprehensive documentation and type definitions."}
                        </p>
                      </div>
                    </div>
                    <div className={"relative flex-1 min-h-0"}>
                      <div className={"relative border-t border-l border-solid border-border-default rounded-tl-xl bg-bg-default flex-1 min-h-0"} style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                        <div className={"p-4"}>
                          <div className={"flex items-center gap-2 mb-3"}>
                            <div className={"tt-field-wrapper"}>
                              <template />
                              <div className={"react-aria-Select"} data-rac={""}>
                                <button id={"react-aria-:Ra9jmb76H2:"} className={"tt-button flex items-center font-medium relative whitespace-nowrap font-sans cursor-pointer aria-button-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-busy:opacity-50 [&_svg]:shrink-0 gap-1.5 px-2.5 py-1.5 rounded-lg text-sm h-tt-small border border-solid shadow-[0_1px_2px_rgba(0,0,0,0.025)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] text-fg-default bg-[hsl(var(--button-default-bg))] border-border-default data-[hovered]:bg-[hsl(var(--button-default-bg-hover))] justify-between !w-20 shrink-0"} data-rac={""} type={"button"} tabIndex={0} data-react-aria-pressable={"true"} aria-label={"HTTP Method"} aria-labelledby={"react-aria-:Ra9jmb76H7: react-aria-:Ra9jmb76H2:"} aria-describedby={"react-aria-:Ra9jmb76H5: react-aria-:Ra9jmb76H6:"} aria-haspopup={"listbox"} aria-expanded={"false"}>
                                  <span id={"react-aria-:Ra9jmb76H7:"} className={"react-aria-SelectValue"} data-rac={""}>
                                    <div className={"flex flex-row w-full items-center gap-2"}>
                                      <div className={"flex-1"}>
                                        {"GET"}
                                      </div>
                                      <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"tt-selected-icon text-fg-secondary"}>
                                        <path d={"M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"} />
                                      </svg>
                                    </div>
                                  </span>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"}>
                                    <path d={"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"} />
                                  </svg>
                                </button>
                                <div style={{ border: "0", clip: "rect(0 0 0 0)", clipPath: "inset(50%)", height: "1px", margin: "-1px", overflow: "hidden", padding: "0", position: "fixed", width: "1px", whiteSpace: "nowrap", top: "0", left: "0" } as CSSProperties} aria-hidden={"true"} data-react-aria-prevent-focus={"true"} data-a11y-ignore={"aria-hidden-focus"} data-testid={"hidden-select-container"}>
                                  <label>
                                    <select tabIndex={-1} defaultValue={"GET"}>
                                      <option />
                                      <option value={"GET"}>
                                        {"GET"}
                                      </option>
                                      <option value={"POST"}>
                                        {"POST"}
                                      </option>
                                      <option value={"PUT"}>
                                        {"PUT"}
                                      </option>
                                      <option value={"DELETE"}>
                                        {"DELETE"}
                                      </option>
                                    </select>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <input type={"text"} className={"flex-1 h-tt-small px-2.5 text-xs font-mono text-fg-default bg-bg-default border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-0"} defaultValue={"api.tokenterminal.com/v2/project/base/metrics"} />
                          </div>
                          <div className={"flex items-center gap-2 font-mono text-xs mb-3"}>
                            <span className={"text-green-600 dark:text-[#1AFFAB]"}>
                              {"200 OK"}
                            </span>
                            <span className={"text-fg-secondary"}>
                              {"•"}
                            </span>
                            <span className={"text-fg-secondary"}>
                              {"309 ms"}
                            </span>
                            <span className={"text-fg-secondary"}>
                              {"•"}
                            </span>
                            <span className={"text-fg-secondary"}>
                              {"535.2 KB"}
                            </span>
                          </div>
                          <div className={"flex items-center gap-4 mb-4 text-xs"}>
                            <button className={"flex items-center gap-1 text-fg-default"}>
                              {"Pretty"}
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5"}>
                                <path d={"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"} />
                              </svg>
                            </button>
                            <span className={"text-fg-secondary"}>
                              {"Headers "}
                              <span className={"opacity-60"}>
                                {"14"}
                              </span>
                            </span>
                          </div>
                          <div className={"font-mono text-[11px] leading-relaxed whitespace-pre"}>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"1"}
                              </span>
                              <span className={"flex-1"}>
                                {"{"}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"2"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"  "}
                                </span>
                                <span className={"text-fg-default"}>
                                  {"\""}
                                  {"data"}
                                  {"\""}
                                </span>
                                {": ["}
                              </span>
                            </div>
                            <div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"3"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"    "}
                                  </span>
                                  {"{"}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"4"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"timestamp"}
                                    {"\""}
                                  </span>
                                  {":"}
                                  {" "}
                                  <span style={{ color: "#E5C07B" } as CSSProperties}>
                                    {"\""}
                                    {"2024-10-21T00:00:00.000Z"}
                                    {"\""}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"5"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"project_name"}
                                    {"\""}
                                  </span>
                                  {":"}
                                  {" "}
                                  <span style={{ color: "#E5C07B" } as CSSProperties}>
                                    {"\""}
                                    {"Base"}
                                    {"\""}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"6"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"project_id"}
                                    {"\""}
                                  </span>
                                  {":"}
                                  {" "}
                                  <span style={{ color: "#E5C07B" } as CSSProperties}>
                                    {"\""}
                                    {"base"}
                                    {"\""}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"7"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"fees"}
                                    {"\""}
                                  </span>
                                  {": "}
                                  <span style={{ color: "#C678DD" } as CSSProperties}>
                                    {"107315.92"}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"8"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"revenue"}
                                    {"\""}
                                  </span>
                                  {": "}
                                  <span style={{ color: "#C678DD" } as CSSProperties}>
                                    {"107315.92"}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"9"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"earnings"}
                                    {"\""}
                                  </span>
                                  {": "}
                                  <span style={{ color: "#C678DD" } as CSSProperties}>
                                    {"106651.32"}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"10"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"user_dau"}
                                    {"\""}
                                  </span>
                                  {": "}
                                  <span style={{ color: "#C678DD" } as CSSProperties}>
                                    {"1662351"}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"11"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"    "}
                                  </span>
                                  {"},"}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"12"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"    "}
                                  </span>
                                  {"{"}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"13"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"timestamp"}
                                    {"\""}
                                  </span>
                                  {":"}
                                  {" "}
                                  <span style={{ color: "#E5C07B" } as CSSProperties}>
                                    {"\""}
                                    {"2024-10-22T00:00:00.000Z"}
                                    {"\""}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"14"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"project_name"}
                                    {"\""}
                                  </span>
                                  {":"}
                                  {" "}
                                  <span style={{ color: "#E5C07B" } as CSSProperties}>
                                    {"\""}
                                    {"Base"}
                                    {"\""}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"15"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"project_id"}
                                    {"\""}
                                  </span>
                                  {":"}
                                  {" "}
                                  <span style={{ color: "#E5C07B" } as CSSProperties}>
                                    {"\""}
                                    {"base"}
                                    {"\""}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"16"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"fees"}
                                    {"\""}
                                  </span>
                                  {": "}
                                  <span style={{ color: "#C678DD" } as CSSProperties}>
                                    {"112458.34"}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"17"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"revenue"}
                                    {"\""}
                                  </span>
                                  {": "}
                                  <span style={{ color: "#C678DD" } as CSSProperties}>
                                    {"112458.34"}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"18"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"earnings"}
                                    {"\""}
                                  </span>
                                  {": "}
                                  <span style={{ color: "#C678DD" } as CSSProperties}>
                                    {"111789.12"}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"19"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"user_dau"}
                                    {"\""}
                                  </span>
                                  {": "}
                                  <span style={{ color: "#C678DD" } as CSSProperties}>
                                    {"1689452"}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"20"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"    "}
                                  </span>
                                  {"}"}
                                </span>
                              </div>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"21"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"  "}
                                </span>
                                {"]"}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"22"}
                              </span>
                              <span className={"flex-1"}>
                                {"}"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"col-span-1"}>
                  <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 rounded-2xl"} style={{ height: "500px" } as CSSProperties} href={"/products/data-room"}>
                    <div className={"flex flex-col"}>
                      <div className={"relative"}>
                        <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                            <path d={"M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z"} />
                          </svg>
                        </div>
                        <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                          {"Data Room"}
                        </span>
                        <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                          {"Access our data warehouse"}
                        </h4>
                        <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                          {"Query raw blockchain data directly in your own data warehouse with schemas for blocks, transactions, and decoded contract events."}
                        </p>
                      </div>
                    </div>
                    <div className={"relative flex-1 min-h-0"}>
                      <div className={"relative border-t border-l border-solid border-border-default rounded-tl-xl overflow-hidden flex-1 min-h-0"} style={{ maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                        <div className={"bg-white dark:bg-[#0a0a0a] border-neutral-200 dark:border-neutral-800"} style={{ width: "calc(100% + 100px)", minWidth: "500px" } as CSSProperties}>
                          <div className={"flex items-center gap-2 px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800"}>
                            <div className={"flex items-center gap-2"}>
                              <div className={"flex items-center gap-1.5"}>
                                <div className={"w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"} />
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5 text-neutral-400 dark:text-neutral-500"}>
                                  <path d={"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"} />
                                </svg>
                              </div>
                              <div className={"w-px h-3 bg-neutral-300 dark:bg-neutral-700"} />
                              <div className={"flex items-center gap-1 px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded"}>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-blue-500 dark:text-blue-400"}>
                                  <path d={"M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z"} />
                                </svg>
                                <span className={"text-xs text-neutral-700 dark:text-neutral-300"}>
                                  {"blocks"}
                                </span>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5 text-neutral-400 dark:text-neutral-500"}>
                                  <path d={"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"} />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className={"flex items-center gap-1.5 px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800 text-[10px]"}>
                            <span className={"text-blue-500 dark:text-blue-400"}>
                              {"blockchain"}
                            </span>
                            <span className={"text-neutral-400 dark:text-neutral-500"}>
                              {"/"}
                            </span>
                            <span className={"text-neutral-500 dark:text-neutral-400"}>
                              {"Datasets"}
                            </span>
                            <span className={"text-neutral-400 dark:text-neutral-500"}>
                              {"/"}
                            </span>
                            <span className={"text-blue-500 dark:text-blue-400"}>
                              {"solana"}
                            </span>
                            <span className={"text-neutral-400 dark:text-neutral-500"}>
                              {"/"}
                            </span>
                            <span className={"text-neutral-700 dark:text-neutral-300 font-medium"}>
                              {"blocks"}
                            </span>
                          </div>
                          <div className={"flex items-center justify-between px-3 py-2 border-b border-neutral-200 dark:border-neutral-800"}>
                            <div className={"flex items-center gap-2"}>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-4 h-4 text-neutral-400 dark:text-neutral-500"}>
                                <path d={"M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"} />
                              </svg>
                              <span className={"text-sm font-medium text-neutral-800 dark:text-neutral-200"}>
                                {"blocks"}
                              </span>
                            </div>
                            <div className={"flex items-center gap-1"}>
                              <button className={"flex items-center gap-1 px-2 py-1 text-[10px] text-blue-500 dark:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"}>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3"}>
                                  <path d={"M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"} />
                                </svg>
                                {"Query"}
                              </button>
                              <button className={"flex items-center gap-1 px-2 py-1 text-[10px] text-blue-500 dark:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"}>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3"}>
                                  <path d={"M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"} />
                                </svg>
                                {"Copy"}
                              </button>
                            </div>
                          </div>
                          <div className={"flex items-center gap-0 px-3 border-b border-neutral-200 dark:border-neutral-800"}>
                            <button className={"px-3 py-2 text-[10px] border-b-2 text-blue-500 dark:text-blue-400 border-blue-500 dark:border-blue-400"}>
                              {"Schema"}
                            </button>
                            <button className={"px-3 py-2 text-[10px] border-b-2 text-neutral-500 dark:text-neutral-400 border-transparent hover:text-neutral-700 dark:hover:text-neutral-300"}>
                              {"Details"}
                            </button>
                            <button className={"px-3 py-2 text-[10px] border-b-2 text-neutral-500 dark:text-neutral-400 border-transparent hover:text-neutral-700 dark:hover:text-neutral-300"}>
                              {"Preview"}
                            </button>
                          </div>
                          <div className={"flex items-center gap-2 px-3 py-2 border-b border-neutral-200 dark:border-neutral-800"}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-neutral-400 dark:text-neutral-500"}>
                              <path d={"M230.6,49.53A15.81,15.81,0,0,0,216,40H40A16,16,0,0,0,28.19,66.76l.08.09L96,139.17V216a16,16,0,0,0,24.87,13.32l32-21.34A16,16,0,0,0,160,194.66V139.17l67.74-72.32.08-.09A15.8,15.8,0,0,0,230.6,49.53ZM40,56h0Zm106.18,74.58A8,8,0,0,0,144,136v58.66L112,216V136a8,8,0,0,0-2.16-5.47L40,56H216Z"} />
                            </svg>
                            <span className={"text-[10px] text-neutral-500 dark:text-neutral-400"}>
                              {"Filter"}
                            </span>
                            <span className={"text-[10px] text-neutral-400 dark:text-neutral-600"}>
                              {"Enter property name or value"}
                            </span>
                          </div>
                          <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800 text-[9px] text-neutral-500 dark:text-neutral-400"}>
                            <div className={"flex items-center"}>
                              <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                            </div>
                            <div>
                              {"Field name"}
                            </div>
                            <div>
                              {"Type"}
                            </div>
                            <div>
                              {"Mode"}
                            </div>
                          </div>
                          <div className={"flex flex-col"}>
                            <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                              <div className={"flex items-center"}>
                                <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                              </div>
                              <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                                {"block_slot"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                                {"INTEGER"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                                {"NULLABLE"}
                              </div>
                            </div>
                            <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                              <div className={"flex items-center"}>
                                <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                              </div>
                              <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                                {"block_hash"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                                {"STRING"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                                {"NULLABLE"}
                              </div>
                            </div>
                            <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                              <div className={"flex items-center"}>
                                <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                              </div>
                              <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                                {"block_height"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                                {"INTEGER"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                                {"NULLABLE"}
                              </div>
                            </div>
                            <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                              <div className={"flex items-center"}>
                                <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                              </div>
                              <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                                {"block_timestamp"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                                {"TIMESTAMP"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                                {"NULLABLE"}
                              </div>
                            </div>
                            <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                              <div className={"flex items-center"}>
                                <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                              </div>
                              <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                                {"parent_slot"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                                {"INTEGER"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                                {"NULLABLE"}
                              </div>
                            </div>
                            <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                              <div className={"flex items-center"}>
                                <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                              </div>
                              <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                                {"previous_block_hash"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                                {"STRING"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                                {"NULLABLE"}
                              </div>
                            </div>
                            <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                              <div className={"flex items-center"}>
                                <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                              </div>
                              <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                                {"total_transaction_count"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                                {"INTEGER"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                                {"NULLABLE"}
                              </div>
                            </div>
                            <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                              <div className={"flex items-center"}>
                                <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                              </div>
                              <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                                {"successful_transaction_count"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                                {"INTEGER"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                                {"NULLABLE"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              <div className={"hidden md:flex lg:hidden flex-col gap-6"}>
                <div className={"grid grid-cols-2 gap-6"}>
                  <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col md:flex-row gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "450px" } as CSSProperties} href={"/products/explorer"}>
                    <div className={"flex-shrink-0 w-full md:w-[40%] flex flex-col"}>
                      <div className={"relative"}>
                        <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                            <path d={"M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"} />
                          </svg>
                        </div>
                        <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                          {"Explorer"}
                        </span>
                        <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                          {"Historical onchain metrics"}
                        </h4>
                        <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                          {"Track blockchain fees, revenue, and other key metrics over time with interactive charts that let you compare performance across projects and chains."}
                        </p>
                      </div>
                    </div>
                    <div className={"relative flex-1 min-h-0 mt-0 md:mt-5"}>
                      <div style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                        <div className={"bg-bg-surface border border-solid border-border-default rounded-tl-xl p-5 w-[800px]"}>
                          <div className={"pb-2"}>
                            <h3 className={"text-sm font-medium text-fg-default"}>
                              {"Fees for L1 blockchains"}
                            </h3>
                          </div>
                          <div className={"flex-1 w-full min-h-0 h-[420px]"} />
                        </div>
                      </div>
                    </div>
                  </a>
                  <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "450px" } as CSSProperties} href={"/products/explorer"}>
                    <div className={"flex flex-col"}>
                      <div className={"relative"}>
                        <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                            <path d={"M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"} />
                          </svg>
                        </div>
                        <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                          {"Explorer"}
                        </span>
                        <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                          {"Tokenized assets"}
                        </h4>
                        <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                          {"Compare the top-performing tokenized assets with standardized metrics like market cap, trading volume, and price changes to identify market trends."}
                        </p>
                      </div>
                    </div>
                    <div className={"relative flex-1 min-h-0"}>
                      <div className={"relative bg-bg-surface border-t border-l border-solid border-border-default rounded-tl-xl flex-1 min-h-0 pt-6 pl-6 flex flex-col overflow-hidden"} style={{ maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                        <div className={"pb-3 flex justify-between items-center shrink-0"}>
                          <h3 className={"text-sm font-medium text-fg-default"}>
                            {"Circulating asset market cap"}
                          </h3>
                          <span className={"text-xs text-fg-tertiary pr-3"}>
                            {"30d"}
                          </span>
                        </div>
                        <div className={"pr-4 flex-1 min-h-0 overflow-hidden"}>
                          <div className={"flex flex-col flex-1 justify-between"}>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                            <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                              <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                              <div className={"flex items-center gap-2 flex-1"}>
                                <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                                <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                              </div>
                              <div className={"flex items-center gap-3"}>
                                <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                                <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"grid grid-cols-3 gap-6"}>
                  <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "500px" } as CSSProperties} href={"/products/explorer"}>
                    <div className={"flex flex-col"}>
                      <div className={"relative"}>
                        <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                            <path d={"M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"} />
                          </svg>
                        </div>
                        <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                          {"Explorer"}
                        </span>
                        <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                          {"Market sectors"}
                        </h4>
                        <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                          {"Visualize how fees and revenue are distributed across market sectors like stablecoins, L1 blockchains, exchanges, and more."}
                        </p>
                      </div>
                    </div>
                    <div className={"relative flex-1 min-h-0"}>
                      <div className={"relative bg-bg-surface border-t border-l border-solid border-border-default rounded-tl-xl flex-1 min-h-0 pt-3 pl-4"} style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                        <div className={"pb-3 shrink-0"}>
                          <h3 className={"text-sm font-medium text-fg-default"}>
                            {"Fees by market sector"}
                          </h3>
                        </div>
                        <div className={"pr-2.5 pb-2 flex-1 min-h-0 h-[250px] w-[600px]"}>
                          <div className={"flex gap-1.5 h-full"}>
                            <div className={"flex-[1.8] min-w-0"}>
                              <div className={"h-full bg-[hsl(var(--chart-1)/0.15)] rounded-lg p-1.5 flex flex-col"}>
                                <div className={"flex items-center gap-1.5 px-1 shrink-0"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"12"} height={"12"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"text-fg-default/50"}>
                                    <path fillRule={"evenodd"} clipRule={"evenodd"} d={"M102.203 103.359C106.395 103.112 110.596 103.693 114.564 105.067L161.839 121.345C168.861 123.762 174.635 128.87 177.89 135.545C181.145 142.219 181.616 149.913 179.199 156.934C178.487 159.003 177.538 160.963 176.387 162.782L219.129 167.31C222.815 167.586 226.394 168.686 229.597 170.535C232.875 172.427 235.673 175.049 237.772 178.197C239.871 181.346 241.218 184.936 241.704 188.688C242.159 192.207 241.848 195.78 240.796 199.162L240.576 199.836L240.574 199.841L240.281 200.645C238.751 204.637 236.204 208.167 232.887 210.88C229.349 213.773 225.074 215.623 220.543 216.223C220.385 216.243 220.225 216.26 220.066 216.271L177.969 219.29C177.549 219.32 177.126 219.317 176.706 219.28L110.983 213.572C110.332 213.516 109.689 213.38 109.071 213.167L40.9928 189.726L10.7369 179.307C6.72468 177.926 3.42528 175.007 1.56506 171.193C-0.295058 167.379 -0.564427 162.983 0.817017 158.971L13.8405 121.149C15.2221 117.137 18.1409 113.839 21.9547 111.978C25.7687 110.118 30.1652 109.849 34.1774 111.23L61.3004 120.569L90.1119 106.517C93.8954 104.68 98.0041 103.607 102.203 103.359ZM109.337 120.187C107.35 119.498 105.246 119.207 103.147 119.331C101.048 119.455 98.993 119.992 97.1012 120.911L68.3141 134.951L53.7662 177.202L113.349 197.719L177.457 203.285L218.627 200.333C220.142 200.1 221.57 199.466 222.758 198.494C223.993 197.485 224.921 196.151 225.441 194.643L225.589 194.17C225.9 193.058 225.984 191.893 225.836 190.744C225.665 189.431 225.195 188.174 224.461 187.073C223.726 185.972 222.747 185.054 221.6 184.392C220.454 183.731 219.169 183.343 217.848 183.258C217.738 183.251 217.628 183.241 217.518 183.229L149.152 175.987C148.552 175.924 147.961 175.792 147.39 175.596L117.133 165.178C112.956 163.739 110.736 159.186 112.174 155.009C113.613 150.831 118.165 148.611 122.342 150.049L148.817 159.165C151.826 160.201 155.124 160 157.985 158.604C160.845 157.209 163.034 154.735 164.07 151.725C165.106 148.716 164.905 145.419 163.509 142.558C162.114 139.698 159.64 137.509 156.63 136.473L109.337 120.187ZM15.9459 164.18L38.6383 171.993L51.6598 134.172L28.9684 126.359L15.9459 164.18ZM150.331 26.6864C157.478 23.7456 165.384 23.1826 172.876 25.0819C180.367 26.9812 187.05 31.2416 191.933 37.2323C194.678 40.599 196.772 44.4118 198.142 48.4764C200.049 48.1645 202.005 47.9999 204 47.9999C223.882 47.9999 240 64.1177 240 83.9999C240 103.882 223.882 120 204 120C188.139 120 174.674 109.743 169.876 95.4999C165.628 96.1988 161.263 96.1354 156.989 95.2831C149.409 93.7716 142.517 89.8605 137.332 84.1288C132.147 78.3971 128.944 71.1487 128.197 63.4559C127.45 55.7631 129.2 48.0338 133.186 41.412C137.172 34.7904 143.183 29.6273 150.331 26.6864ZM204 63.9999C201.075 63.9999 198.296 64.6273 195.792 65.7557C195.566 65.8772 195.334 65.9879 195.096 66.0878C188.519 69.3634 184 76.1533 184 83.9999C184 95.0454 192.954 104 204 104C215.045 104 224 95.0456 224 83.9999C224 72.9542 215.045 63.9999 204 63.9999ZM168.944 40.5917C164.782 39.5365 160.39 39.8485 156.419 41.4823C152.448 43.1161 149.109 45.9852 146.894 49.6639C144.68 53.3426 143.708 57.6363 144.123 61.91C144.538 66.1837 146.316 70.2111 149.197 73.3954C152.077 76.5796 155.907 78.7529 160.118 79.5927C162.829 80.1333 165.606 80.101 168.277 79.5204C169.556 69.2158 175.189 60.2625 183.279 54.5585C182.541 51.937 181.272 49.4775 179.531 47.3417C176.818 44.0137 173.106 41.6469 168.944 40.5917Z"} />
                                  </svg>
                                  <span className={"text-xs text-fg-default/80 truncate"}>
                                    {"Stablecoin issuers"}
                                  </span>
                                </div>
                                <div className={"flex-1 grid grid-cols-2 gap-1 mt-1.5 min-h-0"}>
                                  <div className={"bg-[hsl(var(--chart-1)/0.35)] hover:bg-[hsl(var(--chart-1)/0.45)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden row-span-2"}>
                                    <div className={"mb-auto"}>
                                      <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                        <img alt={"Tether"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_4.png"} />
                                      </div>
                                    </div>
                                    <div className={"mt-auto pt-1"}>
                                      <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                        {"Tether"}
                                      </p>
                                      <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                        {"$417.9M"}
                                        {" ("}
                                        {"25.9"}
                                        {"%)"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={"bg-[hsl(var(--chart-1)/0.35)] hover:bg-[hsl(var(--chart-1)/0.45)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden "}>
                                    <div className={"mb-auto"}>
                                      <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                        <img alt={"Circle"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_10.png"} />
                                      </div>
                                    </div>
                                    <div className={"mt-auto pt-1"}>
                                      <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                        {"Circle"}
                                      </p>
                                      <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                        {"$197.1M"}
                                        {" ("}
                                        {"12.2"}
                                        {"%)"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={"flex gap-1"}>
                                    <div className={"bg-[hsl(var(--chart-1)/0.35)] hover:bg-[hsl(var(--chart-1)/0.45)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                      <div className={"mb-auto"}>
                                        <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                          <img alt={"Sky"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_13.png"} />
                                        </div>
                                      </div>
                                      <div className={"mt-auto pt-1"}>
                                        <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                          {"Sky"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className={"bg-[hsl(var(--chart-1)/0.35)] hover:bg-[hsl(var(--chart-1)/0.45)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                      <div className={"mb-auto"}>
                                        <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                          <img alt={"Ethena"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_8.png"} />
                                        </div>
                                      </div>
                                      <div className={"mt-auto pt-1"}>
                                        <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                          {"Ethena"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={"flex-[1.2] min-w-0"}>
                              <div className={"h-full bg-[hsl(var(--chart-2)/0.15)] rounded-lg p-1.5 flex flex-col"}>
                                <div className={"flex items-center gap-1.5 px-1 shrink-0"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"12"} height={"12"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"text-fg-default/50"}>
                                    <path d={"M223.68,66.15,135.68,18h0a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32h0l80.34,44L128,120,47.66,76ZM40,90l80,43.78v85.79L40,175.82Zm96,129.57V133.82L216,90v85.78Z"} />
                                  </svg>
                                  <span className={"text-xs text-fg-default/80 truncate"}>
                                    {"Blockchains (L1)"}
                                  </span>
                                </div>
                                <div className={"flex-1 flex flex-col gap-1 mt-1.5 min-h-0"}>
                                  <div className={"bg-[hsl(var(--chart-2)/0.30)] hover:bg-[hsl(var(--chart-2)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-[1.5]"}>
                                    <div className={"mb-auto"}>
                                      <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                        <img alt={"Tron"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo.png"} />
                                      </div>
                                    </div>
                                    <div className={"mt-auto pt-1"}>
                                      <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                        {"Tron"}
                                      </p>
                                      <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                        {"$207.8M"}
                                        {" ("}
                                        {"12.9"}
                                        {"%)"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={"bg-[hsl(var(--chart-2)/0.30)] hover:bg-[hsl(var(--chart-2)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                    <div className={"mb-auto"}>
                                      <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                        <img alt={"Zcash"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_1.png"} />
                                      </div>
                                    </div>
                                    <div className={"mt-auto pt-1"}>
                                      <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                        {"Zcash"}
                                      </p>
                                      <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                        {"$124.1M"}
                                        {" ("}
                                        {"7.7"}
                                        {"%)"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={"flex gap-1 flex-[0.6]"}>
                                    <div className={"bg-[hsl(var(--chart-2)/0.30)] hover:bg-[hsl(var(--chart-2)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                      <div className={"mb-auto"}>
                                        <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                          <img alt={"Solana"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_7.png"} />
                                        </div>
                                      </div>
                                      <div className={"mt-auto pt-1"}>
                                        <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                          {"Solana"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className={"bg-[hsl(var(--chart-2)/0.30)] rounded flex-1 flex items-center justify-center"}>
                                      <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "14px", height: "14px" } as CSSProperties}>
                                        <img alt={"BNB Chain"} loading={"lazy"} width={"14"} height={"14"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_5.png"} />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={"flex-1 flex flex-col gap-1.5 min-w-0"}>
                              <div className={"flex-1"}>
                                <div className={"h-full bg-[hsl(var(--chart-3)/0.15)] rounded-lg p-1.5 flex flex-col"}>
                                  <div className={"flex items-center gap-1.5 px-1 shrink-0"}>
                                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"12"} height={"12"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"text-fg-default/50"}>
                                      <path d={"M213.66,181.66l-32,32a8,8,0,0,1-11.32-11.32L188.69,184H48a8,8,0,0,1,0-16H188.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,213.66,181.66Zm-139.32-64a8,8,0,0,0,11.32-11.32L67.31,88H208a8,8,0,0,0,0-16H67.31L85.66,53.66A8,8,0,0,0,74.34,42.34l-32,32a8,8,0,0,0,0,11.32Z"} />
                                    </svg>
                                    <span className={"text-xs text-fg-default/80 truncate"}>
                                      {"Exchanges (DEX)"}
                                    </span>
                                  </div>
                                  <div className={"flex-1 grid grid-cols-2 gap-1 mt-1.5 min-h-0"}>
                                    <div className={"bg-[hsl(var(--chart-3)/0.30)] hover:bg-[hsl(var(--chart-3)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden "}>
                                      <div className={"mb-auto"}>
                                        <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                          <img alt={"PancakeSwap"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_9.png"} />
                                        </div>
                                      </div>
                                      <div className={"mt-auto pt-1"}>
                                        <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                          {"PancakeSwap"}
                                        </p>
                                        <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                          {"$48.9M"}
                                          {" ("}
                                          {"3.0"}
                                          {"%)"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className={"flex flex-col gap-1"}>
                                      <div className={"bg-[hsl(var(--chart-3)/0.30)] hover:bg-[hsl(var(--chart-3)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                        <div className={"mb-auto"}>
                                          <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                            <img alt={"pump.fun"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_11.png"} />
                                          </div>
                                        </div>
                                        <div className={"mt-auto pt-1"}>
                                          <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                            {"pump.fun"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className={"bg-[hsl(var(--chart-3)/0.30)] hover:bg-[hsl(var(--chart-3)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                        <div className={"mb-auto"}>
                                          <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                            <img alt={"Uniswap"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_6.png"} />
                                          </div>
                                        </div>
                                        <div className={"mt-auto pt-1"}>
                                          <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                            {"Uniswap"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={"flex-1"}>
                                <div className={"h-full bg-[hsl(var(--chart-12)/0.15)] rounded-lg p-1.5 flex flex-col"}>
                                  <div className={"flex items-center gap-1.5 px-1 shrink-0"}>
                                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"12"} height={"12"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"text-fg-default/50"}>
                                      <path d={"M232,64H208V48a8,8,0,0,0-8-8H56a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8Zm144-8.9c0,35.52-29,64.64-64,64.9a64,64,0,0,1-64-64V56H192ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z"} />
                                    </svg>
                                    <span className={"text-xs text-fg-default/80 truncate"}>
                                      {"Liquid staking"}
                                    </span>
                                  </div>
                                  <div className={"flex-1 grid grid-cols-2 gap-1 mt-1.5 min-h-0"}>
                                    <div className={"bg-[hsl(var(--chart-12)/0.30)] hover:bg-[hsl(var(--chart-12)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden "}>
                                      <div className={"mb-auto"}>
                                        <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                          <img alt={"Lido Finance"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_3.png"} />
                                        </div>
                                      </div>
                                      <div className={"mt-auto pt-1"}>
                                        <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                          {"Lido Finance"}
                                        </p>
                                        <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                          {"$78.0M"}
                                          {" ("}
                                          {"4.8"}
                                          {"%)"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className={"flex flex-col gap-1"}>
                                      <div className={"bg-[hsl(var(--chart-12)/0.30)] hover:bg-[hsl(var(--chart-12)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                        <div className={"mb-auto"}>
                                          <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                            <img alt={"Jito"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_2.png"} />
                                          </div>
                                        </div>
                                        <div className={"mt-auto pt-1"}>
                                          <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                            {"Jito"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className={"bg-[hsl(var(--chart-12)/0.30)] hover:bg-[hsl(var(--chart-12)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                        <div className={"mb-auto"}>
                                          <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                            <img alt={"ether.fi"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_12.png"} />
                                          </div>
                                        </div>
                                        <div className={"mt-auto pt-1"}>
                                          <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                            {"ether.fi"}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                  <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "500px" } as CSSProperties} href={"/products/explorer"}>
                    <div className={"flex flex-col"}>
                      <div className={"relative"}>
                        <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                            <path d={"M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"} />
                          </svg>
                        </div>
                        <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                          {"Explorer"}
                        </span>
                        <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                          {"Financial statements"}
                        </h4>
                        <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                          {"Analyze income statements with fees, revenue, expenses, and earnings for blockchain projects using traditional financial reporting formats."}
                        </p>
                      </div>
                    </div>
                    <div className={"relative flex-1 min-h-0"}>
                      <div className={"relative bg-bg-surface border-t border-l border-solid border-border-default rounded-tl-xl flex-1 min-h-0"} style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                        <div className={"overflow-x-hidden overflow-y-hidden relative w-full"}>
                          <div className={"w-full overflow-x-auto  relative"}>
                            <table data-density={"large"} data-row-border-radius={"none"} data-row-hover={"false"} data-row-style={"no-border"} data-last-row-border={"false"} className={"tt-table financial-statement-table w-full"} style={{ "--cell-font-size": "12px", "--cell-padding-x": "8px" } as CSSProperties}>
                              <thead className={"tt-table-header"}>
                                <tr className={"tt-table-row"}>
                                  <th className={"tt-table-header-cell min-w-[180px] sticky left-0 z-10 bg-bg-surface border-b border-solid border-border-default"}>
                                    <div className={"flex items-center gap-1.5"}>
                                      <img alt={"Ethereum"} loading={"lazy"} width={"14"} height={"14"} decoding={"async"} data-nimg={"1"} className={"w-3.5 h-3.5 rounded-full object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/ethereum.png"} />
                                      <span className={"text-sm text-fg-default"}>
                                        {"Ethereum"}
                                      </span>
                                    </div>
                                  </th>
                                  <th className={"tt-table-header-cell border-b border-solid border-border-default"} style={{ minWidth: "120px" } as CSSProperties}>
                                    <div className={"flex flex-col gap-0 leading-none items-end"}>
                                      <div className={"text-sm font-medium"}>
                                        {"Jan 2026"}
                                      </div>
                                    </div>
                                  </th>
                                  <th className={"tt-table-header-cell border-b border-solid border-border-default"} style={{ minWidth: "120px" } as CSSProperties}>
                                    <div className={"flex flex-col gap-0 leading-none items-end"}>
                                      <div className={"text-sm font-medium"}>
                                        {"Dec 2025"}
                                      </div>
                                    </div>
                                  </th>
                                  <th className={"tt-table-header-cell border-b border-solid border-border-default"} style={{ minWidth: "120px" } as CSSProperties}>
                                    <div className={"flex flex-col gap-0 leading-none items-end"}>
                                      <div className={"text-sm font-medium"}>
                                        {"Nov 2025"}
                                      </div>
                                    </div>
                                  </th>
                                  <th className={"tt-table-header-cell border-b border-solid border-border-default"} style={{ minWidth: "120px" } as CSSProperties}>
                                    <div className={"flex flex-col gap-0 leading-none items-end"}>
                                      <div className={"text-sm font-medium"}>
                                        {"Oct 2025"}
                                      </div>
                                    </div>
                                  </th>
                                </tr>
                              </thead>
                              <tbody className={"tt-table-body"}>
                                <tr className={"tt-table-row"}>
                                  <td className={"tt-table-cell font-medium pt-3.5 pb-1 sticky left-0 z-10 bg-bg-surface"}>
                                    {"Income statement"}
                                  </td>
                                  <td className={"tt-table-cell pt-0 pb-1"} />
                                  <td className={"tt-table-cell pt-0 pb-1"} />
                                  <td className={"tt-table-cell pt-0 pb-1"} />
                                  <td className={"tt-table-cell pt-0 pb-1"} />
                                </tr>
                                <tr className={"tt-table-row group/metric-row"}>
                                  <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"text-fg-secondary "}>
                                      {"Fees"}
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"312.4M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"4.8"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"298.1M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-red"}>
                                          {"-"}
                                          {"2.1"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"287.6M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"4.5"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"275.2M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"3.2"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className={"tt-table-row group/metric-row"}>
                                  <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"text-fg-secondary "}>
                                      {"Revenue"}
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"312.4M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"4.8"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"298.1M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-red"}>
                                          {"-"}
                                          {"2.1"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"287.6M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"4.5"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"275.2M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"3.2"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className={"tt-table-row group/metric-row"}>
                                  <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"text-fg-secondary ml-3"}>
                                      {"(Expenses)"}
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"45.2M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"5.6"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"42.8M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"3.6"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"41.3M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"3.8"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"39.8M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"2.9"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className={"tt-table-row group/metric-row"}>
                                  <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)] border-t border-solid border-border-default"}>
                                    <div className={"text-fg-default "}>
                                      {"Earnings"}
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)] border-t border-solid border-border-default"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"267.2M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"4.7"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)] border-t border-solid border-border-default"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"255.3M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-red"}>
                                          {"-"}
                                          {"2.5"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)] border-t border-solid border-border-default"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"246.3M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"4.6"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)] border-t border-solid border-border-default"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"235.4M"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"3.4"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className={"tt-table-row"}>
                                  <td className={"tt-table-cell px-0 pt-3.5 pb-1 sticky left-0 z-10 bg-bg-surface"}>
                                    <div className={"h-px border-t border-solid border-border-default"} />
                                  </td>
                                  <td className={"tt-table-cell px-0 pt-3.5 pb-1"} colSpan={4}>
                                    <div className={"h-px border-t border-solid border-border-default"} />
                                  </td>
                                </tr>
                                <tr className={"tt-table-row"}>
                                  <td className={"tt-table-cell font-medium pt-3.5 pb-1 sticky left-0 z-10 bg-bg-surface"}>
                                    {"Market data"}
                                  </td>
                                  <td className={"tt-table-cell pt-0 pb-1"} />
                                  <td className={"tt-table-cell pt-0 pb-1"} />
                                  <td className={"tt-table-cell pt-0 pb-1"} />
                                  <td className={"tt-table-cell pt-0 pb-1"} />
                                </tr>
                                <tr className={"tt-table-row group/metric-row"}>
                                  <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"text-fg-secondary "}>
                                      {"Price"}
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"3.4K"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"3.7"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"3.3K"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"4.5"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"3.2K"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"2.2"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"3.1K"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-red"}>
                                          {"-"}
                                          {"1.2"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                                <tr className={"tt-table-row group/metric-row"}>
                                  <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"text-fg-secondary "}>
                                      {"Market cap (circulating)"}
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"411.2B"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"3.7"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"396.5B"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"4.5"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"379.4B"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-emerald"}>
                                          {"+"}
                                          {"2.2"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                  <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                    <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                      <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                        <span className={"text-fg-secondary/80"}>
                                          {"$"}
                                        </span>
                                        <span>
                                          {"371.2B"}
                                        </span>
                                      </div>
                                      <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                        <span className={"text-fg-red"}>
                                          {"-"}
                                          {"1.2"}
                                          {"%"}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                  <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "500px" } as CSSProperties} href={"/products/studio"}>
                    <div className={"flex flex-col"}>
                      <div className={"relative"}>
                        <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                            <path d={"M248,92.68a15.86,15.86,0,0,0-4.69-11.31L174.63,12.68a16,16,0,0,0-22.63,0L123.57,41.11l-58,21.77A16.06,16.06,0,0,0,55.35,75.23L32.11,214.68A8,8,0,0,0,40,224a8.4,8.4,0,0,0,1.32-.11l139.44-23.24a16,16,0,0,0,12.35-10.17l21.77-58L243.31,104A15.87,15.87,0,0,0,248,92.68Zm-69.87,92.19L63.32,204l47.37-47.37a28,28,0,1,0-11.32-11.32L52,192.7,71.13,77.86,126,57.29,198.7,130ZM112,132a12,12,0,1,1,12,12A12,12,0,0,1,112,132Zm96-15.32L139.31,48l24-24L232,92.68Z"} />
                          </svg>
                        </div>
                        <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                          {"Studio"}
                        </span>
                        <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                          {"Dive deeper with Queries"}
                        </h4>
                        <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                          {"Write and execute SQL queries against raw blockchain data with AI-powered suggestions and instant results."}
                        </p>
                      </div>
                    </div>
                    <div className={"relative flex-1 min-h-0"}>
                      <div className={"relative border-t border-l border-solid border-border-default rounded-tl-xl flex-1 min-h-0"} style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                        <div className={"bg-bg-default overflow-hidden"} style={{ width: "calc(100% + 150px)" } as CSSProperties}>
                          <div className={"flex items-center justify-between px-3 py-1.5 border-b border-border-default bg-bg-default"}>
                            <div className={"flex items-center gap-2 text-xs"}>
                              <span className={"text-fg-secondary"}>
                                {"Queries"}
                              </span>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5 text-fg-secondary"}>
                                <path d={"M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"} />
                              </svg>
                              <span className={"text-fg-default"}>
                                {"Bitcoin active_addresses"}
                              </span>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-fg-secondary"}>
                                <path d={"M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"} />
                              </svg>
                            </div>
                          </div>
                          <div className={"flex"}>
                            <div className={"w-[160px] shrink-0 border-r border-border-default bg-bg-default flex flex-col"}>
                              <div className={"h-[36px] px-3 flex items-center border-b border-border-default"}>
                                <button className={"flex items-center gap-1 text-xs text-fg-default font-medium py-1.5 border-b-2 border-fg-default -mb-[1px]"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3"}>
                                    <path d={"M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z"} />
                                  </svg>
                                  {"Tables"}
                                </button>
                              </div>
                              <div className={"p-2 flex flex-col gap-2"}>
                                <div className={"flex items-center gap-1.5 px-2 py-1.5 bg-bg-inset border border-border-default rounded"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-fg-secondary"}>
                                    <path d={"M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"} />
                                  </svg>
                                  <span className={"text-xs text-fg-secondary"}>
                                    {"Search"}
                                  </span>
                                </div>
                                <div className={"flex flex-col rounded overflow-hidden border border-border-default"}>
                                  <button className={"flex items-center gap-1 h-8 px-2 py-1.5 w-full text-left bg-bg-default hover:bg-neutral-100 dark:hover:bg-neutral-800 border-b border-border-default"}>
                                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-fg-secondary"}>
                                      <path d={"M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"} />
                                    </svg>
                                    <div className={"flex justify-center items-center h-4 w-4 rounded bg-neutral-500/10 dark:bg-neutral-500/30 text-fg-secondary"}>
                                      <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5"}>
                                        <path d={"M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"} />
                                      </svg>
                                    </div>
                                    <span className={"text-xs text-fg-default flex-1"}>
                                      {"metrics"}
                                    </span>
                                    <span className={"text-[10px] text-fg-secondary"}>
                                      {"2"}
                                    </span>
                                  </button>
                                  <button className={"flex items-center gap-1 h-8 px-2 py-1.5 w-full text-left bg-bg-default hover:bg-neutral-100 dark:hover:bg-neutral-800 "}>
                                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-fg-secondary"}>
                                      <path d={"M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"} />
                                    </svg>
                                    <div className={"flex justify-center items-center h-4 w-4 rounded bg-neutral-500/10 dark:bg-neutral-500/30 text-fg-secondary"}>
                                      <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5"}>
                                        <path d={"M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z"} />
                                      </svg>
                                    </div>
                                    <span className={"text-xs text-fg-default flex-1"}>
                                      {"primitives"}
                                    </span>
                                    <span className={"text-[10px] text-fg-secondary"}>
                                      {"2"}
                                    </span>
                                  </button>
                                </div>
                              </div>
                            </div>
                            <div className={"flex-1 flex flex-col min-w-0"}>
                              <div className={"m-3 border border-border-default rounded overflow-hidden bg-bg-inset"}>
                                <div className={"flex font-mono text-xs"}>
                                  <div className={"py-2 px-2 text-right text-fg-tertiary select-none border-r border-border-default bg-bg-default"}>
                                    <div>
                                      {"1"}
                                    </div>
                                    <div>
                                      {"2"}
                                    </div>
                                    <div>
                                      {"3"}
                                    </div>
                                  </div>
                                  <div className={"py-2 px-3 flex-1"}>
                                    <div>
                                      <span className={"text-[#C586C0]"}>
                                        {"select"}
                                      </span>
                                      <span className={"text-fg-default"}>
                                        {" *"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className={"text-[#C586C0]"}>
                                        {"from"}
                                      </span>
                                      <span className={"text-fg-default"}>
                                        {" metrics"}
                                      </span>
                                    </div>
                                    <div>
                                      <span className={"text-[#C586C0]"}>
                                        {"where"}
                                      </span>
                                      <span className={"text-fg-default"}>
                                        {" data_id = "}
                                      </span>
                                      <span className={"text-[#CE9178]"}>
                                        {"'bitcoin'"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className={"flex items-center justify-between px-3 pb-2 text-xs"}>
                                <div className={"flex items-center gap-1 text-fg-secondary"}>
                                  <span className={"px-1 py-0.5 bg-bg-inset border border-border-default rounded text-[10px] font-medium"}>
                                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5 inline"}>
                                      <path d={"M180,144H160V112h20a36,36,0,1,0-36-36V96H112V76a36,36,0,1,0-36,36H96v32H76a36,36,0,1,0,36,36V160h32v20a36,36,0,1,0,36-36ZM160,76a20,20,0,1,1,20,20H160ZM56,76a20,20,0,0,1,40,0V96H76A20,20,0,0,1,56,76ZM96,180a20,20,0,1,1-20-20H96Zm16-68h32v32H112Zm68,88a20,20,0,0,1-20-20V160h20a20,20,0,0,1,0,40Z"} />
                                    </svg>
                                    {"I"}
                                  </span>
                                  <span>
                                    {"AI suggestions"}
                                  </span>
                                </div>
                                <button className={"px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"}>
                                  {"Run query"}
                                </button>
                              </div>
                              <div className={"flex items-center gap-2 px-3 py-2 border-t border-border-default text-xs"}>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3"} style={{ color: "#1AFFAB" } as CSSProperties}>
                                  <path d={"M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"} />
                                </svg>
                                <span className={"text-fg-default font-medium"}>
                                  {"Success"}
                                </span>
                                <span className={"text-fg-secondary"}>
                                  {"21 days ago"}
                                </span>
                              </div>
                              <div className={"border-t border-border-default"}>
                                <table className={"w-full text-xs"}>
                                  <thead>
                                    <tr className={"border-b border-border-default bg-bg-default"}>
                                      <th className={"px-3 py-1.5 text-left font-normal text-fg-default"}>
                                        {"timestamp"}
                                      </th>
                                      <th className={"px-3 py-1.5 text-left font-normal text-fg-default"}>
                                        {"data_id"}
                                      </th>
                                      <th className={"px-3 py-1.5 text-left font-normal text-fg-default"}>
                                        {"value"}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    <tr className={"border-b border-border-default"}>
                                      <td className={"px-3 py-1.5 text-fg-default"}>
                                        {"5/1/2012"}
                                      </td>
                                      <td className={"px-3 py-1.5 text-fg-default"}>
                                        {"bitcoin"}
                                      </td>
                                      <td className={"px-3 py-1.5 text-fg-default tabular-nums"}>
                                        {"11,443"}
                                      </td>
                                    </tr>
                                    <tr className={"border-b border-border-default"}>
                                      <td className={"px-3 py-1.5 text-fg-default"}>
                                        {"5/2/2012"}
                                      </td>
                                      <td className={"px-3 py-1.5 text-fg-default"}>
                                        {"bitcoin"}
                                      </td>
                                      <td className={"px-3 py-1.5 text-fg-default tabular-nums"}>
                                        {"11,573"}
                                      </td>
                                    </tr>
                                    <tr className={"border-b border-border-default"}>
                                      <td className={"px-3 py-1.5 text-fg-default"}>
                                        {"5/5/2012"}
                                      </td>
                                      <td className={"px-3 py-1.5 text-fg-default"}>
                                        {"bitcoin"}
                                      </td>
                                      <td className={"px-3 py-1.5 text-fg-default tabular-nums"}>
                                        {"12,299"}
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
                <div className={"grid grid-cols-3 gap-6"}>
                  <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "500px" } as CSSProperties} href={"/products/sheets"}>
                    <div className={"flex flex-col"}>
                      <div className={"relative"}>
                        <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                            <path d={"M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z"} />
                          </svg>
                        </div>
                        <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                          {"Sheets"}
                        </span>
                        <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                          {"Sheets integration"}
                        </h4>
                        <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                          {"Pull blockchain data directly into Excel and Google Sheets with custom functions for financial statements, metrics, and more."}
                        </p>
                      </div>
                    </div>
                    <div className={"relative flex-1 min-h-0"}>
                      <div className={"relative border-t border-l border-solid border-border-default rounded-tl-xl flex-1 min-h-0"} style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                        <div className={"bg-bg-default"} style={{ width: "calc(100% + 100px)" } as CSSProperties}>
                          <div className={"flex items-center gap-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"}>
                            <div className={"flex items-center gap-1 px-2 py-1.5 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800"}>
                              <input type={"text"} readOnly className={"w-10 text-xs font-medium text-fg-default bg-transparent border-none outline-none cursor-pointer"} defaultValue={"A1"} />
                              <button className={"text-fg-secondary hover:text-fg-default"}>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3"}>
                                  <path d={"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"} />
                                </svg>
                              </button>
                            </div>
                            <div className={"flex-1 flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-950"}>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-4 h-4 text-fg-secondary"}>
                                <path d={"M208,40a8,8,0,0,1-8,8H170.71a24,24,0,0,0-23.62,19.71L137.59,120H184a8,8,0,0,1,0,16H134.68l-10,55.16A40,40,0,0,1,85.29,224H56a8,8,0,0,1,0-16H85.29a24,24,0,0,0,23.62-19.71l9.5-52.29H72a8,8,0,0,1,0-16h49.32l10-55.16A40,40,0,0,1,170.71,32H200A8,8,0,0,1,208,40Z"} />
                              </svg>
                              <div className={"flex-1 font-mono text-xs"}>
                                <span className={"text-fg-default"}>
                                  {"=TT_FINANCIAL_STATEMENT("}
                                </span>
                                <span className={"text-green-600 dark:text-green-400"}>
                                  {"\"ETH\""}
                                </span>
                                <span className={"text-fg-default"}>
                                  {", "}
                                </span>
                                <span className={"text-green-600 dark:text-green-400"}>
                                  {"\"quarter\""}
                                </span>
                                <span className={"text-fg-default"}>
                                  {")"}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={"flex"}>
                            <div className={"w-8 shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"}>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div style={{ height: "24px" } as CSSProperties} />
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-200 dark:bg-neutral-800"} style={{ height: "24px" } as CSSProperties}>
                                  {"1"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"2"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"3"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"4"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"5"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"6"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"7"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"8"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"9"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"10"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"11"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"12"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"13"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"14"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"15"}
                                </div>
                              </div>
                              <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                  {"16"}
                                </div>
                              </div>
                            </div>
                            <div className={"flex-1"}>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center justify-center text-xs border-r border-neutral-200 dark:border-neutral-800 bg-blue-100 dark:bg-blue-900/30"} style={{ height: "24px" } as CSSProperties}>
                                  {"A"}
                                </div>
                                <div className={"w-24 shrink-0 flex items-center justify-center text-xs border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"} style={{ height: "24px" } as CSSProperties}>
                                  {"B"}
                                </div>
                                <div className={"w-24 shrink-0 flex items-center justify-center text-xs border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"} style={{ height: "24px" } as CSSProperties}>
                                  {"C"}
                                </div>
                                <div className={"w-24 shrink-0 flex items-center justify-center text-xs border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"} style={{ height: "24px" } as CSSProperties}>
                                  {"D"}
                                </div>
                                <div className={"w-24 shrink-0 flex items-center justify-center text-xs border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"} style={{ height: "24px" } as CSSProperties}>
                                  {"E"}
                                </div>
                              </div>
                              <div className={"flex flex-col"}>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-blue-50 dark:bg-blue-950/20 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <div className={"absolute inset-0 border-2 border-blue-500 pointer-events-none z-10"} />
                                    <div className={"absolute bottom-0 right-0 w-2 h-2 bg-blue-500 cursor-nwse-resize z-10"} />
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Quarters"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Q1 2026"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Q4 2025"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Q3 2025"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Q2 2025"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Income Statement"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties} />
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties} />
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties} />
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties} />
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Fees"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$4,716,702.18"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$76,566,498.54"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$125,341,114.86"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$103,303,663.73"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Fees_Supply_Side"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$4,010,677.26"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$48,093,226.99"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$69,046,943.74"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$52,989,953.17"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Revenue"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$706,024.92"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$28,473,271.56"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$56,294,171.12"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$50,313,710.56"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Expenses"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$97,171,161.57"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$765,529,137.32"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$933,698,411.71"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$528,485,214.55"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Token_Incentives"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$97,171,161.57"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$765,529,137.32"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$933,698,411.71"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$528,485,214.55"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Earnings"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($96,465,136.64)"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($737,055,865.7)"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($877,404,240.5)"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($478,171,503.9)"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Operating_Expenses"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$12,450,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$45,200,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$52,800,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$38,500,000.00"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Research_Development"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$8,200,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$28,500,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$32,000,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$22,000,000.00"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Sales_Marketing"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$2,850,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$10,200,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$12,500,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$9,800,000.00"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"General_Administrative"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$1,400,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$6,500,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$8,300,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$6,700,000.00"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Operating_Income"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($11,743,975.08)"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($16,726,728.44)"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$3,494,171.12"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$11,813,710.56"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Other_Income"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$125,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$850,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$1,200,000.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$650,000.00"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Interest_Expense"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$0.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$0.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$0.00"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"$0.00"}
                                    </span>
                                  </div>
                                </div>
                                <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"Net_Income"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($96,340,136.64)"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($736,205,865.7)"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($876,204,240.5)"}
                                    </span>
                                  </div>
                                  <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                    <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                      {"($477,521,503.9)"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                  <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "500px" } as CSSProperties} href={"/products/api"}>
                    <div className={"flex flex-col"}>
                      <div className={"relative"}>
                        <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                            <path d={"M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"} />
                          </svg>
                        </div>
                        <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                          {"API"}
                        </span>
                        <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                          {"REST API"}
                        </h4>
                        <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                          {"Access standardized blockchain metrics through a developer-friendly REST API with comprehensive documentation and type definitions."}
                        </p>
                      </div>
                    </div>
                    <div className={"relative flex-1 min-h-0"}>
                      <div className={"relative border-t border-l border-solid border-border-default rounded-tl-xl bg-bg-default flex-1 min-h-0"} style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                        <div className={"p-4"}>
                          <div className={"flex items-center gap-2 mb-3"}>
                            <div className={"tt-field-wrapper"}>
                              <template />
                              <div className={"react-aria-Select"} data-rac={""}>
                                <button id={"react-aria-:Ra9lqb76H2:"} className={"tt-button flex items-center font-medium relative whitespace-nowrap font-sans cursor-pointer aria-button-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-busy:opacity-50 [&_svg]:shrink-0 gap-1.5 px-2.5 py-1.5 rounded-lg text-sm h-tt-small border border-solid shadow-[0_1px_2px_rgba(0,0,0,0.025)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] text-fg-default bg-[hsl(var(--button-default-bg))] border-border-default data-[hovered]:bg-[hsl(var(--button-default-bg-hover))] justify-between !w-20 shrink-0"} data-rac={""} type={"button"} tabIndex={0} data-react-aria-pressable={"true"} aria-label={"HTTP Method"} aria-labelledby={"react-aria-:Ra9lqb76H7: react-aria-:Ra9lqb76H2:"} aria-describedby={"react-aria-:Ra9lqb76H5: react-aria-:Ra9lqb76H6:"} aria-haspopup={"listbox"} aria-expanded={"false"}>
                                  <span id={"react-aria-:Ra9lqb76H7:"} className={"react-aria-SelectValue"} data-rac={""}>
                                    <div className={"flex flex-row w-full items-center gap-2"}>
                                      <div className={"flex-1"}>
                                        {"GET"}
                                      </div>
                                      <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"tt-selected-icon text-fg-secondary"}>
                                        <path d={"M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"} />
                                      </svg>
                                    </div>
                                  </span>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"}>
                                    <path d={"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"} />
                                  </svg>
                                </button>
                                <div style={{ border: "0", clip: "rect(0 0 0 0)", clipPath: "inset(50%)", height: "1px", margin: "-1px", overflow: "hidden", padding: "0", position: "fixed", width: "1px", whiteSpace: "nowrap", top: "0", left: "0" } as CSSProperties} aria-hidden={"true"} data-react-aria-prevent-focus={"true"} data-a11y-ignore={"aria-hidden-focus"} data-testid={"hidden-select-container"}>
                                  <label>
                                    <select tabIndex={-1} defaultValue={"GET"}>
                                      <option />
                                      <option value={"GET"}>
                                        {"GET"}
                                      </option>
                                      <option value={"POST"}>
                                        {"POST"}
                                      </option>
                                      <option value={"PUT"}>
                                        {"PUT"}
                                      </option>
                                      <option value={"DELETE"}>
                                        {"DELETE"}
                                      </option>
                                    </select>
                                  </label>
                                </div>
                              </div>
                            </div>
                            <input type={"text"} className={"flex-1 h-tt-small px-2.5 text-xs font-mono text-fg-default bg-bg-default border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-0"} defaultValue={"api.tokenterminal.com/v2/project/base/metrics"} />
                          </div>
                          <div className={"flex items-center gap-2 font-mono text-xs mb-3"}>
                            <span className={"text-green-600 dark:text-[#1AFFAB]"}>
                              {"200 OK"}
                            </span>
                            <span className={"text-fg-secondary"}>
                              {"•"}
                            </span>
                            <span className={"text-fg-secondary"}>
                              {"309 ms"}
                            </span>
                            <span className={"text-fg-secondary"}>
                              {"•"}
                            </span>
                            <span className={"text-fg-secondary"}>
                              {"535.2 KB"}
                            </span>
                          </div>
                          <div className={"flex items-center gap-4 mb-4 text-xs"}>
                            <button className={"flex items-center gap-1 text-fg-default"}>
                              {"Pretty"}
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5"}>
                                <path d={"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"} />
                              </svg>
                            </button>
                            <span className={"text-fg-secondary"}>
                              {"Headers "}
                              <span className={"opacity-60"}>
                                {"14"}
                              </span>
                            </span>
                          </div>
                          <div className={"font-mono text-[11px] leading-relaxed whitespace-pre"}>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"1"}
                              </span>
                              <span className={"flex-1"}>
                                {"{"}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"2"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"  "}
                                </span>
                                <span className={"text-fg-default"}>
                                  {"\""}
                                  {"data"}
                                  {"\""}
                                </span>
                                {": ["}
                              </span>
                            </div>
                            <div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"3"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"    "}
                                  </span>
                                  {"{"}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"4"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"timestamp"}
                                    {"\""}
                                  </span>
                                  {":"}
                                  {" "}
                                  <span style={{ color: "#E5C07B" } as CSSProperties}>
                                    {"\""}
                                    {"2024-10-21T00:00:00.000Z"}
                                    {"\""}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"5"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"project_name"}
                                    {"\""}
                                  </span>
                                  {":"}
                                  {" "}
                                  <span style={{ color: "#E5C07B" } as CSSProperties}>
                                    {"\""}
                                    {"Base"}
                                    {"\""}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"6"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"project_id"}
                                    {"\""}
                                  </span>
                                  {":"}
                                  {" "}
                                  <span style={{ color: "#E5C07B" } as CSSProperties}>
                                    {"\""}
                                    {"base"}
                                    {"\""}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"7"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"fees"}
                                    {"\""}
                                  </span>
                                  {": "}
                                  <span style={{ color: "#C678DD" } as CSSProperties}>
                                    {"107315.92"}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"8"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"revenue"}
                                    {"\""}
                                  </span>
                                  {": "}
                                  <span style={{ color: "#C678DD" } as CSSProperties}>
                                    {"107315.92"}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"9"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"earnings"}
                                    {"\""}
                                  </span>
                                  {": "}
                                  <span style={{ color: "#C678DD" } as CSSProperties}>
                                    {"106651.32"}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"10"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"user_dau"}
                                    {"\""}
                                  </span>
                                  {": "}
                                  <span style={{ color: "#C678DD" } as CSSProperties}>
                                    {"1662351"}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"11"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"    "}
                                  </span>
                                  {"},"}
                                </span>
                              </div>
                            </div>
                            <div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"12"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"    "}
                                  </span>
                                  {"{"}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"13"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"timestamp"}
                                    {"\""}
                                  </span>
                                  {":"}
                                  {" "}
                                  <span style={{ color: "#E5C07B" } as CSSProperties}>
                                    {"\""}
                                    {"2024-10-22T00:00:00.000Z"}
                                    {"\""}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"14"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"project_name"}
                                    {"\""}
                                  </span>
                                  {":"}
                                  {" "}
                                  <span style={{ color: "#E5C07B" } as CSSProperties}>
                                    {"\""}
                                    {"Base"}
                                    {"\""}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"15"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"project_id"}
                                    {"\""}
                                  </span>
                                  {":"}
                                  {" "}
                                  <span style={{ color: "#E5C07B" } as CSSProperties}>
                                    {"\""}
                                    {"base"}
                                    {"\""}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"16"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"fees"}
                                    {"\""}
                                  </span>
                                  {": "}
                                  <span style={{ color: "#C678DD" } as CSSProperties}>
                                    {"112458.34"}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"17"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"revenue"}
                                    {"\""}
                                  </span>
                                  {": "}
                                  <span style={{ color: "#C678DD" } as CSSProperties}>
                                    {"112458.34"}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"18"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"earnings"}
                                    {"\""}
                                  </span>
                                  {": "}
                                  <span style={{ color: "#C678DD" } as CSSProperties}>
                                    {"111789.12"}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"19"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"      "}
                                  </span>
                                  <span className={"text-fg-default"}>
                                    {"\""}
                                    {"user_dau"}
                                    {"\""}
                                  </span>
                                  {": "}
                                  <span style={{ color: "#C678DD" } as CSSProperties}>
                                    {"1689452"}
                                  </span>
                                  {","}
                                </span>
                              </div>
                              <div className={"flex"}>
                                <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                  {"20"}
                                </span>
                                <span className={"flex-1"}>
                                  <span>
                                    {"    "}
                                  </span>
                                  {"}"}
                                </span>
                              </div>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"21"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"  "}
                                </span>
                                {"]"}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"22"}
                              </span>
                              <span className={"flex-1"}>
                                {"}"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                  <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 rounded-2xl"} style={{ height: "500px" } as CSSProperties} href={"/products/data-room"}>
                    <div className={"flex flex-col"}>
                      <div className={"relative"}>
                        <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                            <path d={"M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z"} />
                          </svg>
                        </div>
                        <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                          {"Data Room"}
                        </span>
                        <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                          {"Access our data warehouse"}
                        </h4>
                        <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                          {"Query raw blockchain data directly in your own data warehouse with schemas for blocks, transactions, and decoded contract events."}
                        </p>
                      </div>
                    </div>
                    <div className={"relative flex-1 min-h-0"}>
                      <div className={"relative border-t border-l border-solid border-border-default rounded-tl-xl overflow-hidden flex-1 min-h-0"} style={{ maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                        <div className={"bg-white dark:bg-[#0a0a0a] border-neutral-200 dark:border-neutral-800"} style={{ width: "calc(100% + 100px)", minWidth: "500px" } as CSSProperties}>
                          <div className={"flex items-center gap-2 px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800"}>
                            <div className={"flex items-center gap-2"}>
                              <div className={"flex items-center gap-1.5"}>
                                <div className={"w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"} />
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5 text-neutral-400 dark:text-neutral-500"}>
                                  <path d={"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"} />
                                </svg>
                              </div>
                              <div className={"w-px h-3 bg-neutral-300 dark:bg-neutral-700"} />
                              <div className={"flex items-center gap-1 px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded"}>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-blue-500 dark:text-blue-400"}>
                                  <path d={"M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z"} />
                                </svg>
                                <span className={"text-xs text-neutral-700 dark:text-neutral-300"}>
                                  {"blocks"}
                                </span>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5 text-neutral-400 dark:text-neutral-500"}>
                                  <path d={"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"} />
                                </svg>
                              </div>
                            </div>
                          </div>
                          <div className={"flex items-center gap-1.5 px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800 text-[10px]"}>
                            <span className={"text-blue-500 dark:text-blue-400"}>
                              {"blockchain"}
                            </span>
                            <span className={"text-neutral-400 dark:text-neutral-500"}>
                              {"/"}
                            </span>
                            <span className={"text-neutral-500 dark:text-neutral-400"}>
                              {"Datasets"}
                            </span>
                            <span className={"text-neutral-400 dark:text-neutral-500"}>
                              {"/"}
                            </span>
                            <span className={"text-blue-500 dark:text-blue-400"}>
                              {"solana"}
                            </span>
                            <span className={"text-neutral-400 dark:text-neutral-500"}>
                              {"/"}
                            </span>
                            <span className={"text-neutral-700 dark:text-neutral-300 font-medium"}>
                              {"blocks"}
                            </span>
                          </div>
                          <div className={"flex items-center justify-between px-3 py-2 border-b border-neutral-200 dark:border-neutral-800"}>
                            <div className={"flex items-center gap-2"}>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-4 h-4 text-neutral-400 dark:text-neutral-500"}>
                                <path d={"M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"} />
                              </svg>
                              <span className={"text-sm font-medium text-neutral-800 dark:text-neutral-200"}>
                                {"blocks"}
                              </span>
                            </div>
                            <div className={"flex items-center gap-1"}>
                              <button className={"flex items-center gap-1 px-2 py-1 text-[10px] text-blue-500 dark:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"}>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3"}>
                                  <path d={"M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"} />
                                </svg>
                                {"Query"}
                              </button>
                              <button className={"flex items-center gap-1 px-2 py-1 text-[10px] text-blue-500 dark:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"}>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3"}>
                                  <path d={"M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"} />
                                </svg>
                                {"Copy"}
                              </button>
                            </div>
                          </div>
                          <div className={"flex items-center gap-0 px-3 border-b border-neutral-200 dark:border-neutral-800"}>
                            <button className={"px-3 py-2 text-[10px] border-b-2 text-blue-500 dark:text-blue-400 border-blue-500 dark:border-blue-400"}>
                              {"Schema"}
                            </button>
                            <button className={"px-3 py-2 text-[10px] border-b-2 text-neutral-500 dark:text-neutral-400 border-transparent hover:text-neutral-700 dark:hover:text-neutral-300"}>
                              {"Details"}
                            </button>
                            <button className={"px-3 py-2 text-[10px] border-b-2 text-neutral-500 dark:text-neutral-400 border-transparent hover:text-neutral-700 dark:hover:text-neutral-300"}>
                              {"Preview"}
                            </button>
                          </div>
                          <div className={"flex items-center gap-2 px-3 py-2 border-b border-neutral-200 dark:border-neutral-800"}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-neutral-400 dark:text-neutral-500"}>
                              <path d={"M230.6,49.53A15.81,15.81,0,0,0,216,40H40A16,16,0,0,0,28.19,66.76l.08.09L96,139.17V216a16,16,0,0,0,24.87,13.32l32-21.34A16,16,0,0,0,160,194.66V139.17l67.74-72.32.08-.09A15.8,15.8,0,0,0,230.6,49.53ZM40,56h0Zm106.18,74.58A8,8,0,0,0,144,136v58.66L112,216V136a8,8,0,0,0-2.16-5.47L40,56H216Z"} />
                            </svg>
                            <span className={"text-[10px] text-neutral-500 dark:text-neutral-400"}>
                              {"Filter"}
                            </span>
                            <span className={"text-[10px] text-neutral-400 dark:text-neutral-600"}>
                              {"Enter property name or value"}
                            </span>
                          </div>
                          <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800 text-[9px] text-neutral-500 dark:text-neutral-400"}>
                            <div className={"flex items-center"}>
                              <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                            </div>
                            <div>
                              {"Field name"}
                            </div>
                            <div>
                              {"Type"}
                            </div>
                            <div>
                              {"Mode"}
                            </div>
                          </div>
                          <div className={"flex flex-col"}>
                            <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                              <div className={"flex items-center"}>
                                <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                              </div>
                              <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                                {"block_slot"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                                {"INTEGER"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                                {"NULLABLE"}
                              </div>
                            </div>
                            <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                              <div className={"flex items-center"}>
                                <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                              </div>
                              <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                                {"block_hash"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                                {"STRING"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                                {"NULLABLE"}
                              </div>
                            </div>
                            <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                              <div className={"flex items-center"}>
                                <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                              </div>
                              <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                                {"block_height"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                                {"INTEGER"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                                {"NULLABLE"}
                              </div>
                            </div>
                            <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                              <div className={"flex items-center"}>
                                <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                              </div>
                              <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                                {"block_timestamp"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                                {"TIMESTAMP"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                                {"NULLABLE"}
                              </div>
                            </div>
                            <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                              <div className={"flex items-center"}>
                                <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                              </div>
                              <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                                {"parent_slot"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                                {"INTEGER"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                                {"NULLABLE"}
                              </div>
                            </div>
                            <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                              <div className={"flex items-center"}>
                                <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                              </div>
                              <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                                {"previous_block_hash"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                                {"STRING"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                                {"NULLABLE"}
                              </div>
                            </div>
                            <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                              <div className={"flex items-center"}>
                                <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                              </div>
                              <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                                {"total_transaction_count"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                                {"INTEGER"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                                {"NULLABLE"}
                              </div>
                            </div>
                            <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                              <div className={"flex items-center"}>
                                <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                              </div>
                              <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                                {"successful_transaction_count"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                                {"INTEGER"}
                              </div>
                              <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                                {"NULLABLE"}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
              <div className={"flex flex-col gap-6 md:hidden"}>
                <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col md:flex-row gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "450px" } as CSSProperties} href={"/products/explorer"}>
                  <div className={"flex-shrink-0 w-full md:w-[40%] flex flex-col"}>
                    <div className={"relative"}>
                      <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                          <path d={"M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"} />
                        </svg>
                      </div>
                      <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                        {"Explorer"}
                      </span>
                      <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                        {"Historical onchain metrics"}
                      </h4>
                      <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                        {"Track blockchain fees, revenue, and other key metrics over time with interactive charts that let you compare performance across projects and chains."}
                      </p>
                    </div>
                  </div>
                  <div className={"relative flex-1 min-h-0 mt-0 md:mt-5"}>
                    <div style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                      <div className={"bg-bg-surface border border-solid border-border-default rounded-tl-xl p-5 w-[800px]"}>
                        <div className={"pb-2"}>
                          <h3 className={"text-sm font-medium text-fg-default"}>
                            {"Fees for L1 blockchains"}
                          </h3>
                        </div>
                        <div className={"flex-1 w-full min-h-0 h-[420px]"} />
                      </div>
                    </div>
                  </div>
                </a>
                <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "450px" } as CSSProperties} href={"/products/explorer"}>
                  <div className={"flex flex-col"}>
                    <div className={"relative"}>
                      <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                          <path d={"M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"} />
                        </svg>
                      </div>
                      <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                        {"Explorer"}
                      </span>
                      <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                        {"Tokenized assets"}
                      </h4>
                      <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                        {"Compare the top-performing tokenized assets with standardized metrics like market cap, trading volume, and price changes to identify market trends."}
                      </p>
                    </div>
                  </div>
                  <div className={"relative flex-1 min-h-0"}>
                    <div className={"relative bg-bg-surface border-t border-l border-solid border-border-default rounded-tl-xl flex-1 min-h-0 pt-6 pl-6 flex flex-col overflow-hidden"} style={{ maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                      <div className={"pb-3 flex justify-between items-center shrink-0"}>
                        <h3 className={"text-sm font-medium text-fg-default"}>
                          {"Circulating asset market cap"}
                        </h3>
                        <span className={"text-xs text-fg-tertiary pr-3"}>
                          {"30d"}
                        </span>
                      </div>
                      <div className={"pr-4 flex-1 min-h-0 overflow-hidden"}>
                        <div className={"flex flex-col flex-1 justify-between"}>
                          <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                            <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                            <div className={"flex items-center gap-2 flex-1"}>
                              <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                              <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                            </div>
                            <div className={"flex items-center gap-3"}>
                              <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                              <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                            </div>
                          </div>
                          <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                            <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                            <div className={"flex items-center gap-2 flex-1"}>
                              <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                              <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                            </div>
                            <div className={"flex items-center gap-3"}>
                              <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                              <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                            </div>
                          </div>
                          <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                            <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                            <div className={"flex items-center gap-2 flex-1"}>
                              <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                              <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                            </div>
                            <div className={"flex items-center gap-3"}>
                              <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                              <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                            </div>
                          </div>
                          <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                            <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                            <div className={"flex items-center gap-2 flex-1"}>
                              <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                              <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                            </div>
                            <div className={"flex items-center gap-3"}>
                              <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                              <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                            </div>
                          </div>
                          <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                            <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                            <div className={"flex items-center gap-2 flex-1"}>
                              <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                              <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                            </div>
                            <div className={"flex items-center gap-3"}>
                              <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                              <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                            </div>
                          </div>
                          <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                            <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                            <div className={"flex items-center gap-2 flex-1"}>
                              <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                              <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                            </div>
                            <div className={"flex items-center gap-3"}>
                              <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                              <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                            </div>
                          </div>
                          <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                            <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                            <div className={"flex items-center gap-2 flex-1"}>
                              <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                              <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                            </div>
                            <div className={"flex items-center gap-3"}>
                              <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                              <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                            </div>
                          </div>
                          <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                            <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                            <div className={"flex items-center gap-2 flex-1"}>
                              <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                              <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                            </div>
                            <div className={"flex items-center gap-3"}>
                              <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                              <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                            </div>
                          </div>
                          <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                            <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                            <div className={"flex items-center gap-2 flex-1"}>
                              <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                              <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                            </div>
                            <div className={"flex items-center gap-3"}>
                              <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                              <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                            </div>
                          </div>
                          <div className={"flex items-center gap-3 py-2 border-b border-border-default last:border-b-0"}>
                            <span className={"w-4 h-4 bg-bg-muted rounded animate-pulse"} />
                            <div className={"flex items-center gap-2 flex-1"}>
                              <div className={"w-5 h-5 bg-bg-muted rounded-full animate-pulse"} />
                              <div className={"h-4 w-16 bg-bg-muted rounded animate-pulse"} />
                            </div>
                            <div className={"flex items-center gap-3"}>
                              <div className={"h-4 w-14 bg-bg-muted rounded animate-pulse"} />
                              <div className={"h-4 w-12 bg-bg-muted rounded animate-pulse"} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
                <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "500px" } as CSSProperties} href={"/products/explorer"}>
                  <div className={"flex flex-col"}>
                    <div className={"relative"}>
                      <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                          <path d={"M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"} />
                        </svg>
                      </div>
                      <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                        {"Explorer"}
                      </span>
                      <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                        {"Market sectors"}
                      </h4>
                      <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                        {"Visualize how fees and revenue are distributed across market sectors like stablecoins, L1 blockchains, exchanges, and more."}
                      </p>
                    </div>
                  </div>
                  <div className={"relative flex-1 min-h-0"}>
                    <div className={"relative bg-bg-surface border-t border-l border-solid border-border-default rounded-tl-xl flex-1 min-h-0 pt-3 pl-4"} style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                      <div className={"pb-3 shrink-0"}>
                        <h3 className={"text-sm font-medium text-fg-default"}>
                          {"Fees by market sector"}
                        </h3>
                      </div>
                      <div className={"pr-2.5 pb-2 flex-1 min-h-0 h-[250px] w-[600px]"}>
                        <div className={"flex gap-1.5 h-full"}>
                          <div className={"flex-[1.8] min-w-0"}>
                            <div className={"h-full bg-[hsl(var(--chart-1)/0.15)] rounded-lg p-1.5 flex flex-col"}>
                              <div className={"flex items-center gap-1.5 px-1 shrink-0"}>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"12"} height={"12"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"text-fg-default/50"}>
                                  <path fillRule={"evenodd"} clipRule={"evenodd"} d={"M102.203 103.359C106.395 103.112 110.596 103.693 114.564 105.067L161.839 121.345C168.861 123.762 174.635 128.87 177.89 135.545C181.145 142.219 181.616 149.913 179.199 156.934C178.487 159.003 177.538 160.963 176.387 162.782L219.129 167.31C222.815 167.586 226.394 168.686 229.597 170.535C232.875 172.427 235.673 175.049 237.772 178.197C239.871 181.346 241.218 184.936 241.704 188.688C242.159 192.207 241.848 195.78 240.796 199.162L240.576 199.836L240.574 199.841L240.281 200.645C238.751 204.637 236.204 208.167 232.887 210.88C229.349 213.773 225.074 215.623 220.543 216.223C220.385 216.243 220.225 216.26 220.066 216.271L177.969 219.29C177.549 219.32 177.126 219.317 176.706 219.28L110.983 213.572C110.332 213.516 109.689 213.38 109.071 213.167L40.9928 189.726L10.7369 179.307C6.72468 177.926 3.42528 175.007 1.56506 171.193C-0.295058 167.379 -0.564427 162.983 0.817017 158.971L13.8405 121.149C15.2221 117.137 18.1409 113.839 21.9547 111.978C25.7687 110.118 30.1652 109.849 34.1774 111.23L61.3004 120.569L90.1119 106.517C93.8954 104.68 98.0041 103.607 102.203 103.359ZM109.337 120.187C107.35 119.498 105.246 119.207 103.147 119.331C101.048 119.455 98.993 119.992 97.1012 120.911L68.3141 134.951L53.7662 177.202L113.349 197.719L177.457 203.285L218.627 200.333C220.142 200.1 221.57 199.466 222.758 198.494C223.993 197.485 224.921 196.151 225.441 194.643L225.589 194.17C225.9 193.058 225.984 191.893 225.836 190.744C225.665 189.431 225.195 188.174 224.461 187.073C223.726 185.972 222.747 185.054 221.6 184.392C220.454 183.731 219.169 183.343 217.848 183.258C217.738 183.251 217.628 183.241 217.518 183.229L149.152 175.987C148.552 175.924 147.961 175.792 147.39 175.596L117.133 165.178C112.956 163.739 110.736 159.186 112.174 155.009C113.613 150.831 118.165 148.611 122.342 150.049L148.817 159.165C151.826 160.201 155.124 160 157.985 158.604C160.845 157.209 163.034 154.735 164.07 151.725C165.106 148.716 164.905 145.419 163.509 142.558C162.114 139.698 159.64 137.509 156.63 136.473L109.337 120.187ZM15.9459 164.18L38.6383 171.993L51.6598 134.172L28.9684 126.359L15.9459 164.18ZM150.331 26.6864C157.478 23.7456 165.384 23.1826 172.876 25.0819C180.367 26.9812 187.05 31.2416 191.933 37.2323C194.678 40.599 196.772 44.4118 198.142 48.4764C200.049 48.1645 202.005 47.9999 204 47.9999C223.882 47.9999 240 64.1177 240 83.9999C240 103.882 223.882 120 204 120C188.139 120 174.674 109.743 169.876 95.4999C165.628 96.1988 161.263 96.1354 156.989 95.2831C149.409 93.7716 142.517 89.8605 137.332 84.1288C132.147 78.3971 128.944 71.1487 128.197 63.4559C127.45 55.7631 129.2 48.0338 133.186 41.412C137.172 34.7904 143.183 29.6273 150.331 26.6864ZM204 63.9999C201.075 63.9999 198.296 64.6273 195.792 65.7557C195.566 65.8772 195.334 65.9879 195.096 66.0878C188.519 69.3634 184 76.1533 184 83.9999C184 95.0454 192.954 104 204 104C215.045 104 224 95.0456 224 83.9999C224 72.9542 215.045 63.9999 204 63.9999ZM168.944 40.5917C164.782 39.5365 160.39 39.8485 156.419 41.4823C152.448 43.1161 149.109 45.9852 146.894 49.6639C144.68 53.3426 143.708 57.6363 144.123 61.91C144.538 66.1837 146.316 70.2111 149.197 73.3954C152.077 76.5796 155.907 78.7529 160.118 79.5927C162.829 80.1333 165.606 80.101 168.277 79.5204C169.556 69.2158 175.189 60.2625 183.279 54.5585C182.541 51.937 181.272 49.4775 179.531 47.3417C176.818 44.0137 173.106 41.6469 168.944 40.5917Z"} />
                                </svg>
                                <span className={"text-xs text-fg-default/80 truncate"}>
                                  {"Stablecoin issuers"}
                                </span>
                              </div>
                              <div className={"flex-1 grid grid-cols-2 gap-1 mt-1.5 min-h-0"}>
                                <div className={"bg-[hsl(var(--chart-1)/0.35)] hover:bg-[hsl(var(--chart-1)/0.45)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden row-span-2"}>
                                  <div className={"mb-auto"}>
                                    <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                      <img alt={"Tether"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_4.png"} />
                                    </div>
                                  </div>
                                  <div className={"mt-auto pt-1"}>
                                    <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                      {"Tether"}
                                    </p>
                                    <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                      {"$417.9M"}
                                      {" ("}
                                      {"25.9"}
                                      {"%)"}
                                    </p>
                                  </div>
                                </div>
                                <div className={"bg-[hsl(var(--chart-1)/0.35)] hover:bg-[hsl(var(--chart-1)/0.45)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden "}>
                                  <div className={"mb-auto"}>
                                    <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                      <img alt={"Circle"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_10.png"} />
                                    </div>
                                  </div>
                                  <div className={"mt-auto pt-1"}>
                                    <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                      {"Circle"}
                                    </p>
                                    <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                      {"$197.1M"}
                                      {" ("}
                                      {"12.2"}
                                      {"%)"}
                                    </p>
                                  </div>
                                </div>
                                <div className={"flex gap-1"}>
                                  <div className={"bg-[hsl(var(--chart-1)/0.35)] hover:bg-[hsl(var(--chart-1)/0.45)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                    <div className={"mb-auto"}>
                                      <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                        <img alt={"Sky"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_13.png"} />
                                      </div>
                                    </div>
                                    <div className={"mt-auto pt-1"}>
                                      <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                        {"Sky"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={"bg-[hsl(var(--chart-1)/0.35)] hover:bg-[hsl(var(--chart-1)/0.45)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                    <div className={"mb-auto"}>
                                      <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                        <img alt={"Ethena"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_8.png"} />
                                      </div>
                                    </div>
                                    <div className={"mt-auto pt-1"}>
                                      <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                        {"Ethena"}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={"flex-[1.2] min-w-0"}>
                            <div className={"h-full bg-[hsl(var(--chart-2)/0.15)] rounded-lg p-1.5 flex flex-col"}>
                              <div className={"flex items-center gap-1.5 px-1 shrink-0"}>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"12"} height={"12"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"text-fg-default/50"}>
                                  <path d={"M223.68,66.15,135.68,18h0a15.88,15.88,0,0,0-15.36,0l-88,48.17a16,16,0,0,0-8.32,14v95.64a16,16,0,0,0,8.32,14l88,48.17a15.88,15.88,0,0,0,15.36,0l88-48.17a16,16,0,0,0,8.32-14V80.18A16,16,0,0,0,223.68,66.15ZM128,32h0l80.34,44L128,120,47.66,76ZM40,90l80,43.78v85.79L40,175.82Zm96,129.57V133.82L216,90v85.78Z"} />
                                </svg>
                                <span className={"text-xs text-fg-default/80 truncate"}>
                                  {"Blockchains (L1)"}
                                </span>
                              </div>
                              <div className={"flex-1 flex flex-col gap-1 mt-1.5 min-h-0"}>
                                <div className={"bg-[hsl(var(--chart-2)/0.30)] hover:bg-[hsl(var(--chart-2)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-[1.5]"}>
                                  <div className={"mb-auto"}>
                                    <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                      <img alt={"Tron"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo.png"} />
                                    </div>
                                  </div>
                                  <div className={"mt-auto pt-1"}>
                                    <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                      {"Tron"}
                                    </p>
                                    <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                      {"$207.8M"}
                                      {" ("}
                                      {"12.9"}
                                      {"%)"}
                                    </p>
                                  </div>
                                </div>
                                <div className={"bg-[hsl(var(--chart-2)/0.30)] hover:bg-[hsl(var(--chart-2)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                  <div className={"mb-auto"}>
                                    <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                      <img alt={"Zcash"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_1.png"} />
                                    </div>
                                  </div>
                                  <div className={"mt-auto pt-1"}>
                                    <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                      {"Zcash"}
                                    </p>
                                    <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                      {"$124.1M"}
                                      {" ("}
                                      {"7.7"}
                                      {"%)"}
                                    </p>
                                  </div>
                                </div>
                                <div className={"flex gap-1 flex-[0.6]"}>
                                  <div className={"bg-[hsl(var(--chart-2)/0.30)] hover:bg-[hsl(var(--chart-2)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                    <div className={"mb-auto"}>
                                      <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                        <img alt={"Solana"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_7.png"} />
                                      </div>
                                    </div>
                                    <div className={"mt-auto pt-1"}>
                                      <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                        {"Solana"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={"bg-[hsl(var(--chart-2)/0.30)] rounded flex-1 flex items-center justify-center"}>
                                    <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "14px", height: "14px" } as CSSProperties}>
                                      <img alt={"BNB Chain"} loading={"lazy"} width={"14"} height={"14"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_5.png"} />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className={"flex-1 flex flex-col gap-1.5 min-w-0"}>
                            <div className={"flex-1"}>
                              <div className={"h-full bg-[hsl(var(--chart-3)/0.15)] rounded-lg p-1.5 flex flex-col"}>
                                <div className={"flex items-center gap-1.5 px-1 shrink-0"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"12"} height={"12"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"text-fg-default/50"}>
                                    <path d={"M213.66,181.66l-32,32a8,8,0,0,1-11.32-11.32L188.69,184H48a8,8,0,0,1,0-16H188.69l-18.35-18.34a8,8,0,0,1,11.32-11.32l32,32A8,8,0,0,1,213.66,181.66Zm-139.32-64a8,8,0,0,0,11.32-11.32L67.31,88H208a8,8,0,0,0,0-16H67.31L85.66,53.66A8,8,0,0,0,74.34,42.34l-32,32a8,8,0,0,0,0,11.32Z"} />
                                  </svg>
                                  <span className={"text-xs text-fg-default/80 truncate"}>
                                    {"Exchanges (DEX)"}
                                  </span>
                                </div>
                                <div className={"flex-1 grid grid-cols-2 gap-1 mt-1.5 min-h-0"}>
                                  <div className={"bg-[hsl(var(--chart-3)/0.30)] hover:bg-[hsl(var(--chart-3)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden "}>
                                    <div className={"mb-auto"}>
                                      <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                        <img alt={"PancakeSwap"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_9.png"} />
                                      </div>
                                    </div>
                                    <div className={"mt-auto pt-1"}>
                                      <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                        {"PancakeSwap"}
                                      </p>
                                      <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                        {"$48.9M"}
                                        {" ("}
                                        {"3.0"}
                                        {"%)"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={"flex flex-col gap-1"}>
                                    <div className={"bg-[hsl(var(--chart-3)/0.30)] hover:bg-[hsl(var(--chart-3)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                      <div className={"mb-auto"}>
                                        <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                          <img alt={"pump.fun"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_11.png"} />
                                        </div>
                                      </div>
                                      <div className={"mt-auto pt-1"}>
                                        <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                          {"pump.fun"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className={"bg-[hsl(var(--chart-3)/0.30)] hover:bg-[hsl(var(--chart-3)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                      <div className={"mb-auto"}>
                                        <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                          <img alt={"Uniswap"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_6.png"} />
                                        </div>
                                      </div>
                                      <div className={"mt-auto pt-1"}>
                                        <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                          {"Uniswap"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={"flex-1"}>
                              <div className={"h-full bg-[hsl(var(--chart-12)/0.15)] rounded-lg p-1.5 flex flex-col"}>
                                <div className={"flex items-center gap-1.5 px-1 shrink-0"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"12"} height={"12"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"text-fg-default/50"}>
                                    <path d={"M232,64H208V48a8,8,0,0,0-8-8H56a8,8,0,0,0-8,8V64H24A16,16,0,0,0,8,80V96a40,40,0,0,0,40,40h3.65A80.13,80.13,0,0,0,120,191.61V216H96a8,8,0,0,0,0,16h64a8,8,0,0,0,0-16H136V191.58c31.94-3.23,58.44-25.64,68.08-55.58H208a40,40,0,0,0,40-40V80A16,16,0,0,0,232,64ZM48,120A24,24,0,0,1,24,96V80H48v32q0,4,.39,8Zm144-8.9c0,35.52-29,64.64-64,64.9a64,64,0,0,1-64-64V56H192ZM232,96a24,24,0,0,1-24,24h-.5a81.81,81.81,0,0,0,.5-8.9V80h24Z"} />
                                  </svg>
                                  <span className={"text-xs text-fg-default/80 truncate"}>
                                    {"Liquid staking"}
                                  </span>
                                </div>
                                <div className={"flex-1 grid grid-cols-2 gap-1 mt-1.5 min-h-0"}>
                                  <div className={"bg-[hsl(var(--chart-12)/0.30)] hover:bg-[hsl(var(--chart-12)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden "}>
                                    <div className={"mb-auto"}>
                                      <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                        <img alt={"Lido Finance"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_3.png"} />
                                      </div>
                                    </div>
                                    <div className={"mt-auto pt-1"}>
                                      <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                        {"Lido Finance"}
                                      </p>
                                      <p className={"text-[9px] text-fg-default/70 truncate leading-tight"}>
                                        {"$78.0M"}
                                        {" ("}
                                        {"4.8"}
                                        {"%)"}
                                      </p>
                                    </div>
                                  </div>
                                  <div className={"flex flex-col gap-1"}>
                                    <div className={"bg-[hsl(var(--chart-12)/0.30)] hover:bg-[hsl(var(--chart-12)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                      <div className={"mb-auto"}>
                                        <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                          <img alt={"Jito"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_2.png"} />
                                        </div>
                                      </div>
                                      <div className={"mt-auto pt-1"}>
                                        <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                          {"Jito"}
                                        </p>
                                      </div>
                                    </div>
                                    <div className={"bg-[hsl(var(--chart-12)/0.30)] hover:bg-[hsl(var(--chart-12)/0.40)] rounded transition-colors duration-150 p-2 flex flex-col justify-end h-full min-h-0 overflow-hidden flex-1"}>
                                      <div className={"mb-auto"}>
                                        <div className={"rounded-full overflow-hidden bg-white/10 flex items-center justify-center shrink-0"} style={{ width: "16px", height: "16px" } as CSSProperties}>
                                          <img alt={"ether.fi"} loading={"lazy"} width={"16"} height={"16"} decoding={"async"} data-nimg={"1"} className={"object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/logo_12.png"} />
                                        </div>
                                      </div>
                                      <div className={"mt-auto pt-1"}>
                                        <p className={"text-[10px] text-fg-default font-medium truncate leading-tight"}>
                                          {"ether.fi"}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
                <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "500px" } as CSSProperties} href={"/products/explorer"}>
                  <div className={"flex flex-col"}>
                    <div className={"relative"}>
                      <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                          <path d={"M237.2,151.87v0a47.1,47.1,0,0,0-2.35-5.45L193.26,51.8a7.82,7.82,0,0,0-1.66-2.44,32,32,0,0,0-45.26,0A8,8,0,0,0,144,55V80H112V55a8,8,0,0,0-2.34-5.66,32,32,0,0,0-45.26,0,7.82,7.82,0,0,0-1.66,2.44L21.15,146.4a47.1,47.1,0,0,0-2.35,5.45v0A48,48,0,1,0,112,168V96h32v72a48,48,0,1,0,93.2-16.13ZM76.71,59.75a16,16,0,0,1,19.29-1v73.51a47.9,47.9,0,0,0-46.79-9.92ZM64,200a32,32,0,1,1,32-32A32,32,0,0,1,64,200ZM160,58.74a16,16,0,0,1,19.29,1l27.5,62.58A47.9,47.9,0,0,0,160,132.25ZM192,200a32,32,0,1,1,32-32A32,32,0,0,1,192,200Z"} />
                        </svg>
                      </div>
                      <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                        {"Explorer"}
                      </span>
                      <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                        {"Financial statements"}
                      </h4>
                      <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                        {"Analyze income statements with fees, revenue, expenses, and earnings for blockchain projects using traditional financial reporting formats."}
                      </p>
                    </div>
                  </div>
                  <div className={"relative flex-1 min-h-0"}>
                    <div className={"relative bg-bg-surface border-t border-l border-solid border-border-default rounded-tl-xl flex-1 min-h-0"} style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                      <div className={"overflow-x-hidden overflow-y-hidden relative w-full"}>
                        <div className={"w-full overflow-x-auto  relative"}>
                          <table data-density={"large"} data-row-border-radius={"none"} data-row-hover={"false"} data-row-style={"no-border"} data-last-row-border={"false"} className={"tt-table financial-statement-table w-full"} style={{ "--cell-font-size": "12px", "--cell-padding-x": "8px" } as CSSProperties}>
                            <thead className={"tt-table-header"}>
                              <tr className={"tt-table-row"}>
                                <th className={"tt-table-header-cell min-w-[180px] sticky left-0 z-10 bg-bg-surface border-b border-solid border-border-default"}>
                                  <div className={"flex items-center gap-1.5"}>
                                    <img alt={"Ethereum"} loading={"lazy"} width={"14"} height={"14"} decoding={"async"} data-nimg={"1"} className={"w-3.5 h-3.5 rounded-full object-cover"} style={{ color: "transparent" } as CSSProperties} src={"images/ethereum.png"} />
                                    <span className={"text-sm text-fg-default"}>
                                      {"Ethereum"}
                                    </span>
                                  </div>
                                </th>
                                <th className={"tt-table-header-cell border-b border-solid border-border-default"} style={{ minWidth: "120px" } as CSSProperties}>
                                  <div className={"flex flex-col gap-0 leading-none items-end"}>
                                    <div className={"text-sm font-medium"}>
                                      {"Jan 2026"}
                                    </div>
                                  </div>
                                </th>
                                <th className={"tt-table-header-cell border-b border-solid border-border-default"} style={{ minWidth: "120px" } as CSSProperties}>
                                  <div className={"flex flex-col gap-0 leading-none items-end"}>
                                    <div className={"text-sm font-medium"}>
                                      {"Dec 2025"}
                                    </div>
                                  </div>
                                </th>
                                <th className={"tt-table-header-cell border-b border-solid border-border-default"} style={{ minWidth: "120px" } as CSSProperties}>
                                  <div className={"flex flex-col gap-0 leading-none items-end"}>
                                    <div className={"text-sm font-medium"}>
                                      {"Nov 2025"}
                                    </div>
                                  </div>
                                </th>
                                <th className={"tt-table-header-cell border-b border-solid border-border-default"} style={{ minWidth: "120px" } as CSSProperties}>
                                  <div className={"flex flex-col gap-0 leading-none items-end"}>
                                    <div className={"text-sm font-medium"}>
                                      {"Oct 2025"}
                                    </div>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className={"tt-table-body"}>
                              <tr className={"tt-table-row"}>
                                <td className={"tt-table-cell font-medium pt-3.5 pb-1 sticky left-0 z-10 bg-bg-surface"}>
                                  {"Income statement"}
                                </td>
                                <td className={"tt-table-cell pt-0 pb-1"} />
                                <td className={"tt-table-cell pt-0 pb-1"} />
                                <td className={"tt-table-cell pt-0 pb-1"} />
                                <td className={"tt-table-cell pt-0 pb-1"} />
                              </tr>
                              <tr className={"tt-table-row group/metric-row"}>
                                <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"text-fg-secondary "}>
                                    {"Fees"}
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"312.4M"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"4.8"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"298.1M"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-red"}>
                                        {"-"}
                                        {"2.1"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"287.6M"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"4.5"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"275.2M"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"3.2"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr className={"tt-table-row group/metric-row"}>
                                <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"text-fg-secondary "}>
                                    {"Revenue"}
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"312.4M"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"4.8"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"298.1M"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-red"}>
                                        {"-"}
                                        {"2.1"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"287.6M"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"4.5"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"275.2M"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"3.2"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr className={"tt-table-row group/metric-row"}>
                                <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"text-fg-secondary ml-3"}>
                                    {"(Expenses)"}
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"45.2M"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"5.6"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"42.8M"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"3.6"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"41.3M"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"3.8"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"39.8M"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"2.9"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr className={"tt-table-row group/metric-row"}>
                                <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)] border-t border-solid border-border-default"}>
                                  <div className={"text-fg-default "}>
                                    {"Earnings"}
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)] border-t border-solid border-border-default"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"267.2M"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"4.7"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)] border-t border-solid border-border-default"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"255.3M"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-red"}>
                                        {"-"}
                                        {"2.5"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)] border-t border-solid border-border-default"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"246.3M"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"4.6"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)] border-t border-solid border-border-default"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"235.4M"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"3.4"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr className={"tt-table-row"}>
                                <td className={"tt-table-cell px-0 pt-3.5 pb-1 sticky left-0 z-10 bg-bg-surface"}>
                                  <div className={"h-px border-t border-solid border-border-default"} />
                                </td>
                                <td className={"tt-table-cell px-0 pt-3.5 pb-1"} colSpan={4}>
                                  <div className={"h-px border-t border-solid border-border-default"} />
                                </td>
                              </tr>
                              <tr className={"tt-table-row"}>
                                <td className={"tt-table-cell font-medium pt-3.5 pb-1 sticky left-0 z-10 bg-bg-surface"}>
                                  {"Market data"}
                                </td>
                                <td className={"tt-table-cell pt-0 pb-1"} />
                                <td className={"tt-table-cell pt-0 pb-1"} />
                                <td className={"tt-table-cell pt-0 pb-1"} />
                                <td className={"tt-table-cell pt-0 pb-1"} />
                              </tr>
                              <tr className={"tt-table-row group/metric-row"}>
                                <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"text-fg-secondary "}>
                                    {"Price"}
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"3.4K"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"3.7"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"3.3K"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"4.5"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"3.2K"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"2.2"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"3.1K"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-red"}>
                                        {"-"}
                                        {"1.2"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                              <tr className={"tt-table-row group/metric-row"}>
                                <td className={"tt-table-cell !py-1 align-top sticky left-0 z-10 bg-bg-surface group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"text-fg-secondary "}>
                                    {"Market cap (circulating)"}
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"411.2B"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"3.7"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"396.5B"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"4.5"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"379.4B"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-emerald"}>
                                        {"+"}
                                        {"2.2"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                                <td className={"tt-table-cell !py-1 align-top group-hover/metric-row:bg-[var(--row-hover-color)]"}>
                                  <div className={"flex items-center justify-end gap-px text-right whitespace-nowrap"} style={{ fontFamily: "var(--font-geist-mono)" } as CSSProperties}>
                                    <div className={"flex items-center gap-0.5 whitespace-nowrap"}>
                                      <span className={"text-fg-secondary/80"}>
                                        {"$"}
                                      </span>
                                      <span>
                                        {"371.2B"}
                                      </span>
                                    </div>
                                    <div className={"min-w-[40px] ml-1 whitespace-nowrap"}>
                                      <span className={"text-fg-red"}>
                                        {"-"}
                                        {"1.2"}
                                        {"%"}
                                      </span>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
                <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "500px" } as CSSProperties} href={"/products/studio"}>
                  <div className={"flex flex-col"}>
                    <div className={"relative"}>
                      <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                          <path d={"M248,92.68a15.86,15.86,0,0,0-4.69-11.31L174.63,12.68a16,16,0,0,0-22.63,0L123.57,41.11l-58,21.77A16.06,16.06,0,0,0,55.35,75.23L32.11,214.68A8,8,0,0,0,40,224a8.4,8.4,0,0,0,1.32-.11l139.44-23.24a16,16,0,0,0,12.35-10.17l21.77-58L243.31,104A15.87,15.87,0,0,0,248,92.68Zm-69.87,92.19L63.32,204l47.37-47.37a28,28,0,1,0-11.32-11.32L52,192.7,71.13,77.86,126,57.29,198.7,130ZM112,132a12,12,0,1,1,12,12A12,12,0,0,1,112,132Zm96-15.32L139.31,48l24-24L232,92.68Z"} />
                        </svg>
                      </div>
                      <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                        {"Studio"}
                      </span>
                      <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                        {"Dive deeper with Queries"}
                      </h4>
                      <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                        {"Write and execute SQL queries against raw blockchain data with AI-powered suggestions and instant results."}
                      </p>
                    </div>
                  </div>
                  <div className={"relative flex-1 min-h-0"}>
                    <div className={"relative border-t border-l border-solid border-border-default rounded-tl-xl flex-1 min-h-0"} style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                      <div className={"bg-bg-default overflow-hidden"} style={{ width: "calc(100% + 150px)" } as CSSProperties}>
                        <div className={"flex items-center justify-between px-3 py-1.5 border-b border-border-default bg-bg-default"}>
                          <div className={"flex items-center gap-2 text-xs"}>
                            <span className={"text-fg-secondary"}>
                              {"Queries"}
                            </span>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5 text-fg-secondary"}>
                              <path d={"M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"} />
                            </svg>
                            <span className={"text-fg-default"}>
                              {"Bitcoin active_addresses"}
                            </span>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-fg-secondary"}>
                              <path d={"M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"} />
                            </svg>
                          </div>
                        </div>
                        <div className={"flex"}>
                          <div className={"w-[160px] shrink-0 border-r border-border-default bg-bg-default flex flex-col"}>
                            <div className={"h-[36px] px-3 flex items-center border-b border-border-default"}>
                              <button className={"flex items-center gap-1 text-xs text-fg-default font-medium py-1.5 border-b-2 border-fg-default -mb-[1px]"}>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3"}>
                                  <path d={"M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z"} />
                                </svg>
                                {"Tables"}
                              </button>
                            </div>
                            <div className={"p-2 flex flex-col gap-2"}>
                              <div className={"flex items-center gap-1.5 px-2 py-1.5 bg-bg-inset border border-border-default rounded"}>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-fg-secondary"}>
                                  <path d={"M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"} />
                                </svg>
                                <span className={"text-xs text-fg-secondary"}>
                                  {"Search"}
                                </span>
                              </div>
                              <div className={"flex flex-col rounded overflow-hidden border border-border-default"}>
                                <button className={"flex items-center gap-1 h-8 px-2 py-1.5 w-full text-left bg-bg-default hover:bg-neutral-100 dark:hover:bg-neutral-800 border-b border-border-default"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-fg-secondary"}>
                                    <path d={"M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"} />
                                  </svg>
                                  <div className={"flex justify-center items-center h-4 w-4 rounded bg-neutral-500/10 dark:bg-neutral-500/30 text-fg-secondary"}>
                                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5"}>
                                      <path d={"M232,208a8,8,0,0,1-8,8H32a8,8,0,0,1-8-8V48a8,8,0,0,1,16,0v94.37L90.73,98a8,8,0,0,1,10.07-.38l58.81,44.11L218.73,90a8,8,0,1,1,10.54,12l-64,56a8,8,0,0,1-10.07.38L96.39,114.29,40,163.63V200H224A8,8,0,0,1,232,208Z"} />
                                    </svg>
                                  </div>
                                  <span className={"text-xs text-fg-default flex-1"}>
                                    {"metrics"}
                                  </span>
                                  <span className={"text-[10px] text-fg-secondary"}>
                                    {"2"}
                                  </span>
                                </button>
                                <button className={"flex items-center gap-1 h-8 px-2 py-1.5 w-full text-left bg-bg-default hover:bg-neutral-100 dark:hover:bg-neutral-800 "}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-fg-secondary"}>
                                    <path d={"M181.66,133.66l-80,80a8,8,0,0,1-11.32-11.32L164.69,128,90.34,53.66a8,8,0,0,1,11.32-11.32l80,80A8,8,0,0,1,181.66,133.66Z"} />
                                  </svg>
                                  <div className={"flex justify-center items-center h-4 w-4 rounded bg-neutral-500/10 dark:bg-neutral-500/30 text-fg-secondary"}>
                                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5"}>
                                      <path d={"M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z"} />
                                    </svg>
                                  </div>
                                  <span className={"text-xs text-fg-default flex-1"}>
                                    {"primitives"}
                                  </span>
                                  <span className={"text-[10px] text-fg-secondary"}>
                                    {"2"}
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className={"flex-1 flex flex-col min-w-0"}>
                            <div className={"m-3 border border-border-default rounded overflow-hidden bg-bg-inset"}>
                              <div className={"flex font-mono text-xs"}>
                                <div className={"py-2 px-2 text-right text-fg-tertiary select-none border-r border-border-default bg-bg-default"}>
                                  <div>
                                    {"1"}
                                  </div>
                                  <div>
                                    {"2"}
                                  </div>
                                  <div>
                                    {"3"}
                                  </div>
                                </div>
                                <div className={"py-2 px-3 flex-1"}>
                                  <div>
                                    <span className={"text-[#C586C0]"}>
                                      {"select"}
                                    </span>
                                    <span className={"text-fg-default"}>
                                      {" *"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className={"text-[#C586C0]"}>
                                      {"from"}
                                    </span>
                                    <span className={"text-fg-default"}>
                                      {" metrics"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className={"text-[#C586C0]"}>
                                      {"where"}
                                    </span>
                                    <span className={"text-fg-default"}>
                                      {" data_id = "}
                                    </span>
                                    <span className={"text-[#CE9178]"}>
                                      {"'bitcoin'"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className={"flex items-center justify-between px-3 pb-2 text-xs"}>
                              <div className={"flex items-center gap-1 text-fg-secondary"}>
                                <span className={"px-1 py-0.5 bg-bg-inset border border-border-default rounded text-[10px] font-medium"}>
                                  <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5 inline"}>
                                    <path d={"M180,144H160V112h20a36,36,0,1,0-36-36V96H112V76a36,36,0,1,0-36,36H96v32H76a36,36,0,1,0,36,36V160h32v20a36,36,0,1,0,36-36ZM160,76a20,20,0,1,1,20,20H160ZM56,76a20,20,0,0,1,40,0V96H76A20,20,0,0,1,56,76ZM96,180a20,20,0,1,1-20-20H96Zm16-68h32v32H112Zm68,88a20,20,0,0,1-20-20V160h20a20,20,0,0,1,0,40Z"} />
                                  </svg>
                                  {"I"}
                                </span>
                                <span>
                                  {"AI suggestions"}
                                </span>
                              </div>
                              <button className={"px-3 py-1 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700"}>
                                {"Run query"}
                              </button>
                            </div>
                            <div className={"flex items-center gap-2 px-3 py-2 border-t border-border-default text-xs"}>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3"} style={{ color: "#1AFFAB" } as CSSProperties}>
                                <path d={"M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"} />
                              </svg>
                              <span className={"text-fg-default font-medium"}>
                                {"Success"}
                              </span>
                              <span className={"text-fg-secondary"}>
                                {"21 days ago"}
                              </span>
                            </div>
                            <div className={"border-t border-border-default"}>
                              <table className={"w-full text-xs"}>
                                <thead>
                                  <tr className={"border-b border-border-default bg-bg-default"}>
                                    <th className={"px-3 py-1.5 text-left font-normal text-fg-default"}>
                                      {"timestamp"}
                                    </th>
                                    <th className={"px-3 py-1.5 text-left font-normal text-fg-default"}>
                                      {"data_id"}
                                    </th>
                                    <th className={"px-3 py-1.5 text-left font-normal text-fg-default"}>
                                      {"value"}
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr className={"border-b border-border-default"}>
                                    <td className={"px-3 py-1.5 text-fg-default"}>
                                      {"5/1/2012"}
                                    </td>
                                    <td className={"px-3 py-1.5 text-fg-default"}>
                                      {"bitcoin"}
                                    </td>
                                    <td className={"px-3 py-1.5 text-fg-default tabular-nums"}>
                                      {"11,443"}
                                    </td>
                                  </tr>
                                  <tr className={"border-b border-border-default"}>
                                    <td className={"px-3 py-1.5 text-fg-default"}>
                                      {"5/2/2012"}
                                    </td>
                                    <td className={"px-3 py-1.5 text-fg-default"}>
                                      {"bitcoin"}
                                    </td>
                                    <td className={"px-3 py-1.5 text-fg-default tabular-nums"}>
                                      {"11,573"}
                                    </td>
                                  </tr>
                                  <tr className={"border-b border-border-default"}>
                                    <td className={"px-3 py-1.5 text-fg-default"}>
                                      {"5/5/2012"}
                                    </td>
                                    <td className={"px-3 py-1.5 text-fg-default"}>
                                      {"bitcoin"}
                                    </td>
                                    <td className={"px-3 py-1.5 text-fg-default tabular-nums"}>
                                      {"12,299"}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
                <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "500px" } as CSSProperties} href={"/products/sheets"}>
                  <div className={"flex flex-col"}>
                    <div className={"relative"}>
                      <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                          <path d={"M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z"} />
                        </svg>
                      </div>
                      <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                        {"Sheets"}
                      </span>
                      <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                        {"Sheets integration"}
                      </h4>
                      <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                        {"Pull blockchain data directly into Excel and Google Sheets with custom functions for financial statements, metrics, and more."}
                      </p>
                    </div>
                  </div>
                  <div className={"relative flex-1 min-h-0"}>
                    <div className={"relative border-t border-l border-solid border-border-default rounded-tl-xl flex-1 min-h-0"} style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                      <div className={"bg-bg-default"} style={{ width: "calc(100% + 100px)" } as CSSProperties}>
                        <div className={"flex items-center gap-0 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"}>
                          <div className={"flex items-center gap-1 px-2 py-1.5 bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800"}>
                            <input type={"text"} readOnly className={"w-10 text-xs font-medium text-fg-default bg-transparent border-none outline-none cursor-pointer"} defaultValue={"A1"} />
                            <button className={"text-fg-secondary hover:text-fg-default"}>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3"}>
                                <path d={"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"} />
                              </svg>
                            </button>
                          </div>
                          <div className={"flex-1 flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-950"}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-4 h-4 text-fg-secondary"}>
                              <path d={"M208,40a8,8,0,0,1-8,8H170.71a24,24,0,0,0-23.62,19.71L137.59,120H184a8,8,0,0,1,0,16H134.68l-10,55.16A40,40,0,0,1,85.29,224H56a8,8,0,0,1,0-16H85.29a24,24,0,0,0,23.62-19.71l9.5-52.29H72a8,8,0,0,1,0-16h49.32l10-55.16A40,40,0,0,1,170.71,32H200A8,8,0,0,1,208,40Z"} />
                            </svg>
                            <div className={"flex-1 font-mono text-xs"}>
                              <span className={"text-fg-default"}>
                                {"=TT_FINANCIAL_STATEMENT("}
                              </span>
                              <span className={"text-green-600 dark:text-green-400"}>
                                {"\"ETH\""}
                              </span>
                              <span className={"text-fg-default"}>
                                {", "}
                              </span>
                              <span className={"text-green-600 dark:text-green-400"}>
                                {"\"quarter\""}
                              </span>
                              <span className={"text-fg-default"}>
                                {")"}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className={"flex"}>
                          <div className={"w-8 shrink-0 border-r border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900"}>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div style={{ height: "24px" } as CSSProperties} />
                            </div>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"flex items-center justify-center text-xs font-medium bg-neutral-200 dark:bg-neutral-800"} style={{ height: "24px" } as CSSProperties}>
                                {"1"}
                              </div>
                            </div>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                {"2"}
                              </div>
                            </div>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                {"3"}
                              </div>
                            </div>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                {"4"}
                              </div>
                            </div>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                {"5"}
                              </div>
                            </div>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                {"6"}
                              </div>
                            </div>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                {"7"}
                              </div>
                            </div>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                {"8"}
                              </div>
                            </div>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                {"9"}
                              </div>
                            </div>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                {"10"}
                              </div>
                            </div>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                {"11"}
                              </div>
                            </div>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                {"12"}
                              </div>
                            </div>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                {"13"}
                              </div>
                            </div>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                {"14"}
                              </div>
                            </div>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                {"15"}
                              </div>
                            </div>
                            <div className={"border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"flex items-center justify-center text-xs font-medium bg-neutral-50 dark:bg-neutral-900"} style={{ height: "24px" } as CSSProperties}>
                                {"16"}
                              </div>
                            </div>
                          </div>
                          <div className={"flex-1"}>
                            <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                              <div className={"w-24 shrink-0 flex items-center justify-center text-xs border-r border-neutral-200 dark:border-neutral-800 bg-blue-100 dark:bg-blue-900/30"} style={{ height: "24px" } as CSSProperties}>
                                {"A"}
                              </div>
                              <div className={"w-24 shrink-0 flex items-center justify-center text-xs border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"} style={{ height: "24px" } as CSSProperties}>
                                {"B"}
                              </div>
                              <div className={"w-24 shrink-0 flex items-center justify-center text-xs border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"} style={{ height: "24px" } as CSSProperties}>
                                {"C"}
                              </div>
                              <div className={"w-24 shrink-0 flex items-center justify-center text-xs border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"} style={{ height: "24px" } as CSSProperties}>
                                {"D"}
                              </div>
                              <div className={"w-24 shrink-0 flex items-center justify-center text-xs border-r border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950"} style={{ height: "24px" } as CSSProperties}>
                                {"E"}
                              </div>
                            </div>
                            <div className={"flex flex-col"}>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-blue-50 dark:bg-blue-950/20 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <div className={"absolute inset-0 border-2 border-blue-500 pointer-events-none z-10"} />
                                  <div className={"absolute bottom-0 right-0 w-2 h-2 bg-blue-500 cursor-nwse-resize z-10"} />
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Quarters"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Q1 2026"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Q4 2025"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Q3 2025"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Q2 2025"}
                                  </span>
                                </div>
                              </div>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Income Statement"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties} />
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties} />
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties} />
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties} />
                              </div>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Fees"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$4,716,702.18"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$76,566,498.54"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$125,341,114.86"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$103,303,663.73"}
                                  </span>
                                </div>
                              </div>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Fees_Supply_Side"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$4,010,677.26"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$48,093,226.99"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$69,046,943.74"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$52,989,953.17"}
                                  </span>
                                </div>
                              </div>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Revenue"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$706,024.92"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$28,473,271.56"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$56,294,171.12"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$50,313,710.56"}
                                  </span>
                                </div>
                              </div>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Expenses"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$97,171,161.57"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$765,529,137.32"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$933,698,411.71"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$528,485,214.55"}
                                  </span>
                                </div>
                              </div>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Token_Incentives"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$97,171,161.57"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$765,529,137.32"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$933,698,411.71"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$528,485,214.55"}
                                  </span>
                                </div>
                              </div>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Earnings"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"($96,465,136.64)"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"($737,055,865.7)"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"($877,404,240.5)"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"($478,171,503.9)"}
                                  </span>
                                </div>
                              </div>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Operating_Expenses"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$12,450,000.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$45,200,000.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$52,800,000.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$38,500,000.00"}
                                  </span>
                                </div>
                              </div>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Research_Development"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$8,200,000.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$28,500,000.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$32,000,000.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$22,000,000.00"}
                                  </span>
                                </div>
                              </div>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Sales_Marketing"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$2,850,000.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$10,200,000.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$12,500,000.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$9,800,000.00"}
                                  </span>
                                </div>
                              </div>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"General_Administrative"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$1,400,000.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$6,500,000.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$8,300,000.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$6,700,000.00"}
                                  </span>
                                </div>
                              </div>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Operating_Income"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"($11,743,975.08)"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"($16,726,728.44)"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$3,494,171.12"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$11,813,710.56"}
                                  </span>
                                </div>
                              </div>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Other_Income"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$125,000.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$850,000.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$1,200,000.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$650,000.00"}
                                  </span>
                                </div>
                              </div>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Interest_Expense"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$0.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$0.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$0.00"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"$0.00"}
                                  </span>
                                </div>
                              </div>
                              <div className={"flex border-b border-neutral-200 dark:border-neutral-800"}>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-start"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"Net_Income"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"($96,340,136.64)"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"($736,205,865.7)"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"($876,204,240.5)"}
                                  </span>
                                </div>
                                <div className={"w-24 shrink-0 flex items-center px-1.5 text-xs border-r border-neutral-200 dark:border-neutral-800 relative bg-white dark:bg-neutral-950 justify-end"} style={{ height: "24px" } as CSSProperties}>
                                  <span className={"text-xs relative z-0 text-fg-default truncate"}>
                                    {"($477,521,503.9)"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
                <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 "} style={{ height: "500px" } as CSSProperties} href={"/products/api"}>
                  <div className={"flex flex-col"}>
                    <div className={"relative"}>
                      <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                          <path d={"M69.12,94.15,28.5,128l40.62,33.85a8,8,0,1,1-10.24,12.29l-48-40a8,8,0,0,1,0-12.29l48-40a8,8,0,0,1,10.24,12.3Zm176,27.7-48-40a8,8,0,1,0-10.24,12.3L227.5,128l-40.62,33.85a8,8,0,1,0,10.24,12.29l48-40a8,8,0,0,0,0-12.29ZM162.73,32.48a8,8,0,0,0-10.25,4.79l-64,176a8,8,0,0,0,4.79,10.26A8.14,8.14,0,0,0,96,224a8,8,0,0,0,7.52-5.27l64-176A8,8,0,0,0,162.73,32.48Z"} />
                        </svg>
                      </div>
                      <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                        {"API"}
                      </span>
                      <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                        {"REST API"}
                      </h4>
                      <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                        {"Access standardized blockchain metrics through a developer-friendly REST API with comprehensive documentation and type definitions."}
                      </p>
                    </div>
                  </div>
                  <div className={"relative flex-1 min-h-0"}>
                    <div className={"relative border-t border-l border-solid border-border-default rounded-tl-xl bg-bg-default flex-1 min-h-0"} style={{ overflow: "hidden", maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                      <div className={"p-4"}>
                        <div className={"flex items-center gap-2 mb-3"}>
                          <div className={"tt-field-wrapper"}>
                            <template />
                            <div className={"react-aria-Select"} data-rac={""}>
                              <button id={"react-aria-:Ra9jub76H2:"} className={"tt-button flex items-center font-medium relative whitespace-nowrap font-sans cursor-pointer aria-button-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:cursor-not-allowed aria-disabled:opacity-50 data-[disabled]:pointer-events-none data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50 aria-busy:opacity-50 [&_svg]:shrink-0 gap-1.5 px-2.5 py-1.5 rounded-lg text-sm h-tt-small border border-solid shadow-[0_1px_2px_rgba(0,0,0,0.025)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.1)] text-fg-default bg-[hsl(var(--button-default-bg))] border-border-default data-[hovered]:bg-[hsl(var(--button-default-bg-hover))] justify-between !w-20 shrink-0"} data-rac={""} type={"button"} tabIndex={0} data-react-aria-pressable={"true"} aria-label={"HTTP Method"} aria-labelledby={"react-aria-:Ra9jub76H7: react-aria-:Ra9jub76H2:"} aria-describedby={"react-aria-:Ra9jub76H5: react-aria-:Ra9jub76H6:"} aria-haspopup={"listbox"} aria-expanded={"false"}>
                                <span id={"react-aria-:Ra9jub76H7:"} className={"react-aria-SelectValue"} data-rac={""}>
                                  <div className={"flex flex-row w-full items-center gap-2"}>
                                    <div className={"flex-1"}>
                                      {"GET"}
                                    </div>
                                    <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"tt-selected-icon text-fg-secondary"}>
                                      <path d={"M229.66,77.66l-128,128a8,8,0,0,1-11.32,0l-56-56a8,8,0,0,1,11.32-11.32L96,188.69,218.34,66.34a8,8,0,0,1,11.32,11.32Z"} />
                                    </svg>
                                  </div>
                                </span>
                                <svg xmlns={"http://www.w3.org/2000/svg"} width={"14"} height={"14"} fill={"currentColor"} viewBox={"0 0 256 256"}>
                                  <path d={"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"} />
                                </svg>
                              </button>
                              <div style={{ border: "0", clip: "rect(0 0 0 0)", clipPath: "inset(50%)", height: "1px", margin: "-1px", overflow: "hidden", padding: "0", position: "fixed", width: "1px", whiteSpace: "nowrap", top: "0", left: "0" } as CSSProperties} aria-hidden={"true"} data-react-aria-prevent-focus={"true"} data-a11y-ignore={"aria-hidden-focus"} data-testid={"hidden-select-container"}>
                                <label>
                                  <select tabIndex={-1} defaultValue={"GET"}>
                                    <option />
                                    <option value={"GET"}>
                                      {"GET"}
                                    </option>
                                    <option value={"POST"}>
                                      {"POST"}
                                    </option>
                                    <option value={"PUT"}>
                                      {"PUT"}
                                    </option>
                                    <option value={"DELETE"}>
                                      {"DELETE"}
                                    </option>
                                  </select>
                                </label>
                              </div>
                            </div>
                          </div>
                          <input type={"text"} className={"flex-1 h-tt-small px-2.5 text-xs font-mono text-fg-default bg-bg-default border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-0"} defaultValue={"api.tokenterminal.com/v2/project/base/metrics"} />
                        </div>
                        <div className={"flex items-center gap-2 font-mono text-xs mb-3"}>
                          <span className={"text-green-600 dark:text-[#1AFFAB]"}>
                            {"200 OK"}
                          </span>
                          <span className={"text-fg-secondary"}>
                            {"•"}
                          </span>
                          <span className={"text-fg-secondary"}>
                            {"309 ms"}
                          </span>
                          <span className={"text-fg-secondary"}>
                            {"•"}
                          </span>
                          <span className={"text-fg-secondary"}>
                            {"535.2 KB"}
                          </span>
                        </div>
                        <div className={"flex items-center gap-4 mb-4 text-xs"}>
                          <button className={"flex items-center gap-1 text-fg-default"}>
                            {"Pretty"}
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5"}>
                              <path d={"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"} />
                            </svg>
                          </button>
                          <span className={"text-fg-secondary"}>
                            {"Headers "}
                            <span className={"opacity-60"}>
                              {"14"}
                            </span>
                          </span>
                        </div>
                        <div className={"font-mono text-[11px] leading-relaxed whitespace-pre"}>
                          <div className={"flex"}>
                            <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                              {"1"}
                            </span>
                            <span className={"flex-1"}>
                              {"{"}
                            </span>
                          </div>
                          <div className={"flex"}>
                            <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                              {"2"}
                            </span>
                            <span className={"flex-1"}>
                              <span>
                                {"  "}
                              </span>
                              <span className={"text-fg-default"}>
                                {"\""}
                                {"data"}
                                {"\""}
                              </span>
                              {": ["}
                            </span>
                          </div>
                          <div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"3"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"    "}
                                </span>
                                {"{"}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"4"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"      "}
                                </span>
                                <span className={"text-fg-default"}>
                                  {"\""}
                                  {"timestamp"}
                                  {"\""}
                                </span>
                                {":"}
                                {" "}
                                <span style={{ color: "#E5C07B" } as CSSProperties}>
                                  {"\""}
                                  {"2024-10-21T00:00:00.000Z"}
                                  {"\""}
                                </span>
                                {","}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"5"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"      "}
                                </span>
                                <span className={"text-fg-default"}>
                                  {"\""}
                                  {"project_name"}
                                  {"\""}
                                </span>
                                {":"}
                                {" "}
                                <span style={{ color: "#E5C07B" } as CSSProperties}>
                                  {"\""}
                                  {"Base"}
                                  {"\""}
                                </span>
                                {","}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"6"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"      "}
                                </span>
                                <span className={"text-fg-default"}>
                                  {"\""}
                                  {"project_id"}
                                  {"\""}
                                </span>
                                {":"}
                                {" "}
                                <span style={{ color: "#E5C07B" } as CSSProperties}>
                                  {"\""}
                                  {"base"}
                                  {"\""}
                                </span>
                                {","}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"7"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"      "}
                                </span>
                                <span className={"text-fg-default"}>
                                  {"\""}
                                  {"fees"}
                                  {"\""}
                                </span>
                                {": "}
                                <span style={{ color: "#C678DD" } as CSSProperties}>
                                  {"107315.92"}
                                </span>
                                {","}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"8"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"      "}
                                </span>
                                <span className={"text-fg-default"}>
                                  {"\""}
                                  {"revenue"}
                                  {"\""}
                                </span>
                                {": "}
                                <span style={{ color: "#C678DD" } as CSSProperties}>
                                  {"107315.92"}
                                </span>
                                {","}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"9"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"      "}
                                </span>
                                <span className={"text-fg-default"}>
                                  {"\""}
                                  {"earnings"}
                                  {"\""}
                                </span>
                                {": "}
                                <span style={{ color: "#C678DD" } as CSSProperties}>
                                  {"106651.32"}
                                </span>
                                {","}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"10"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"      "}
                                </span>
                                <span className={"text-fg-default"}>
                                  {"\""}
                                  {"user_dau"}
                                  {"\""}
                                </span>
                                {": "}
                                <span style={{ color: "#C678DD" } as CSSProperties}>
                                  {"1662351"}
                                </span>
                                {","}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"11"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"    "}
                                </span>
                                {"},"}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"12"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"    "}
                                </span>
                                {"{"}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"13"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"      "}
                                </span>
                                <span className={"text-fg-default"}>
                                  {"\""}
                                  {"timestamp"}
                                  {"\""}
                                </span>
                                {":"}
                                {" "}
                                <span style={{ color: "#E5C07B" } as CSSProperties}>
                                  {"\""}
                                  {"2024-10-22T00:00:00.000Z"}
                                  {"\""}
                                </span>
                                {","}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"14"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"      "}
                                </span>
                                <span className={"text-fg-default"}>
                                  {"\""}
                                  {"project_name"}
                                  {"\""}
                                </span>
                                {":"}
                                {" "}
                                <span style={{ color: "#E5C07B" } as CSSProperties}>
                                  {"\""}
                                  {"Base"}
                                  {"\""}
                                </span>
                                {","}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"15"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"      "}
                                </span>
                                <span className={"text-fg-default"}>
                                  {"\""}
                                  {"project_id"}
                                  {"\""}
                                </span>
                                {":"}
                                {" "}
                                <span style={{ color: "#E5C07B" } as CSSProperties}>
                                  {"\""}
                                  {"base"}
                                  {"\""}
                                </span>
                                {","}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"16"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"      "}
                                </span>
                                <span className={"text-fg-default"}>
                                  {"\""}
                                  {"fees"}
                                  {"\""}
                                </span>
                                {": "}
                                <span style={{ color: "#C678DD" } as CSSProperties}>
                                  {"112458.34"}
                                </span>
                                {","}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"17"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"      "}
                                </span>
                                <span className={"text-fg-default"}>
                                  {"\""}
                                  {"revenue"}
                                  {"\""}
                                </span>
                                {": "}
                                <span style={{ color: "#C678DD" } as CSSProperties}>
                                  {"112458.34"}
                                </span>
                                {","}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"18"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"      "}
                                </span>
                                <span className={"text-fg-default"}>
                                  {"\""}
                                  {"earnings"}
                                  {"\""}
                                </span>
                                {": "}
                                <span style={{ color: "#C678DD" } as CSSProperties}>
                                  {"111789.12"}
                                </span>
                                {","}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"19"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"      "}
                                </span>
                                <span className={"text-fg-default"}>
                                  {"\""}
                                  {"user_dau"}
                                  {"\""}
                                </span>
                                {": "}
                                <span style={{ color: "#C678DD" } as CSSProperties}>
                                  {"1689452"}
                                </span>
                                {","}
                              </span>
                            </div>
                            <div className={"flex"}>
                              <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                                {"20"}
                              </span>
                              <span className={"flex-1"}>
                                <span>
                                  {"    "}
                                </span>
                                {"}"}
                              </span>
                            </div>
                          </div>
                          <div className={"flex"}>
                            <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                              {"21"}
                            </span>
                            <span className={"flex-1"}>
                              <span>
                                {"  "}
                              </span>
                              {"]"}
                            </span>
                          </div>
                          <div className={"flex"}>
                            <span className={"w-6 text-right pr-3 text-fg-secondary select-none shrink-0 text-[10px]"}>
                              {"22"}
                            </span>
                            <span className={"flex-1"}>
                              {"}"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
                <a className={"relative group bg-bg-surface border border-solid border-border-default rounded-xl pt-6 pl-6 overflow-hidden flex flex-col gap-6 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 hover:border-border-hover transition-colors duration-200 rounded-2xl"} style={{ height: "500px" } as CSSProperties} href={"/products/data-room"}>
                  <div className={"flex flex-col"}>
                    <div className={"relative"}>
                      <div className={"flex items-center justify-center w-10 h-10 rounded-lg border border-solid border-border-default mb-4"}>
                        <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-5 h-5 text-fg-default"}>
                          <path d={"M128,24C74.17,24,32,48.6,32,80v96c0,31.4,42.17,56,96,56s96-24.6,96-56V80C224,48.6,181.83,24,128,24Zm80,104c0,9.62-7.88,19.43-21.61,26.92C170.93,163.35,150.19,168,128,168s-42.93-4.65-58.39-13.08C55.88,147.43,48,137.62,48,128V111.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64ZM69.61,53.08C85.07,44.65,105.81,40,128,40s42.93,4.65,58.39,13.08C200.12,60.57,208,70.38,208,80s-7.88,19.43-21.61,26.92C170.93,115.35,150.19,120,128,120s-42.93-4.65-58.39-13.08C55.88,99.43,48,89.62,48,80S55.88,60.57,69.61,53.08ZM186.39,202.92C170.93,211.35,150.19,216,128,216s-42.93-4.65-58.39-13.08C55.88,195.43,48,185.62,48,176V159.36c17.06,15,46.23,24.64,80,24.64s62.94-9.68,80-24.64V176C208,185.62,200.12,195.43,186.39,202.92Z"} />
                        </svg>
                      </div>
                      <span className={"text-xs font-mono uppercase tracking-wider text-fg-secondary mb-1"}>
                        {"Data Room"}
                      </span>
                      <h4 className={"text-xl font-medium tracking-tight text-fg-default mb-3"}>
                        {"Access our data warehouse"}
                      </h4>
                      <p className={"text-sm text-fg-secondary leading-relaxed max-w-[350px] text-balance"}>
                        {"Query raw blockchain data directly in your own data warehouse with schemas for blocks, transactions, and decoded contract events."}
                      </p>
                    </div>
                  </div>
                  <div className={"relative flex-1 min-h-0"}>
                    <div className={"relative border-t border-l border-solid border-border-default rounded-tl-xl overflow-hidden flex-1 min-h-0"} style={{ maskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", WebkitMaskImage: "linear-gradient(to bottom, black, transparent), radial-gradient(circle at top left, black 70%, rgba(0,0,0,0.8))", maskComposite: "intersect", WebkitMaskComposite: "source-in" } as CSSProperties}>
                      <div className={"bg-white dark:bg-[#0a0a0a] border-neutral-200 dark:border-neutral-800"} style={{ width: "calc(100% + 100px)", minWidth: "500px" } as CSSProperties}>
                        <div className={"flex items-center gap-2 px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800"}>
                          <div className={"flex items-center gap-2"}>
                            <div className={"flex items-center gap-1.5"}>
                              <div className={"w-2.5 h-2.5 rounded-full bg-neutral-300 dark:bg-neutral-700"} />
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5 text-neutral-400 dark:text-neutral-500"}>
                                <path d={"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"} />
                              </svg>
                            </div>
                            <div className={"w-px h-3 bg-neutral-300 dark:bg-neutral-700"} />
                            <div className={"flex items-center gap-1 px-1.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded"}>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-blue-500 dark:text-blue-400"}>
                                <path d={"M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48ZM40,112H80v32H40Zm56,0H216v32H96ZM216,64V96H40V64ZM40,160H80v32H40Zm176,32H96V160H216v32Z"} />
                              </svg>
                              <span className={"text-xs text-neutral-700 dark:text-neutral-300"}>
                                {"blocks"}
                              </span>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-2.5 h-2.5 text-neutral-400 dark:text-neutral-500"}>
                                <path d={"M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z"} />
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className={"flex items-center gap-1.5 px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800 text-[10px]"}>
                          <span className={"text-blue-500 dark:text-blue-400"}>
                            {"blockchain"}
                          </span>
                          <span className={"text-neutral-400 dark:text-neutral-500"}>
                            {"/"}
                          </span>
                          <span className={"text-neutral-500 dark:text-neutral-400"}>
                            {"Datasets"}
                          </span>
                          <span className={"text-neutral-400 dark:text-neutral-500"}>
                            {"/"}
                          </span>
                          <span className={"text-blue-500 dark:text-blue-400"}>
                            {"solana"}
                          </span>
                          <span className={"text-neutral-400 dark:text-neutral-500"}>
                            {"/"}
                          </span>
                          <span className={"text-neutral-700 dark:text-neutral-300 font-medium"}>
                            {"blocks"}
                          </span>
                        </div>
                        <div className={"flex items-center justify-between px-3 py-2 border-b border-neutral-200 dark:border-neutral-800"}>
                          <div className={"flex items-center gap-2"}>
                            <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-4 h-4 text-neutral-400 dark:text-neutral-500"}>
                              <path d={"M239.18,97.26A16.38,16.38,0,0,0,224.92,86l-59-4.76L143.14,26.15a16.36,16.36,0,0,0-30.27,0L90.11,81.23,31.08,86a16.46,16.46,0,0,0-9.37,28.86l45,38.83L53,211.75a16.38,16.38,0,0,0,24.5,17.82L128,198.49l50.53,31.08A16.4,16.4,0,0,0,203,211.75l-13.76-58.07,45-38.83A16.43,16.43,0,0,0,239.18,97.26Zm-15.34,5.47-48.7,42a8,8,0,0,0-2.56,7.91l14.88,62.8a.37.37,0,0,1-.17.48c-.18.14-.23.11-.38,0l-54.72-33.65a8,8,0,0,0-8.38,0L69.09,215.94c-.15.09-.19.12-.38,0a.37.37,0,0,1-.17-.48l14.88-62.8a8,8,0,0,0-2.56-7.91l-48.7-42c-.12-.1-.23-.19-.13-.5s.18-.27.33-.29l63.92-5.16A8,8,0,0,0,103,91.86l24.62-59.61c.08-.17.11-.25.35-.25s.27.08.35.25L153,91.86a8,8,0,0,0,6.75,4.92l63.92,5.16c.15,0,.24,0,.33.29S224,102.63,223.84,102.73Z"} />
                            </svg>
                            <span className={"text-sm font-medium text-neutral-800 dark:text-neutral-200"}>
                              {"blocks"}
                            </span>
                          </div>
                          <div className={"flex items-center gap-1"}>
                            <button className={"flex items-center gap-1 px-2 py-1 text-[10px] text-blue-500 dark:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"}>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3"}>
                                <path d={"M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"} />
                              </svg>
                              {"Query"}
                            </button>
                            <button className={"flex items-center gap-1 px-2 py-1 text-[10px] text-blue-500 dark:text-blue-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded"}>
                              <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3"}>
                                <path d={"M216,32H88a8,8,0,0,0-8,8V80H40a8,8,0,0,0-8,8V216a8,8,0,0,0,8,8H168a8,8,0,0,0,8-8V176h40a8,8,0,0,0,8-8V40A8,8,0,0,0,216,32ZM160,208H48V96H160Zm48-48H176V88a8,8,0,0,0-8-8H96V48H208Z"} />
                              </svg>
                              {"Copy"}
                            </button>
                          </div>
                        </div>
                        <div className={"flex items-center gap-0 px-3 border-b border-neutral-200 dark:border-neutral-800"}>
                          <button className={"px-3 py-2 text-[10px] border-b-2 text-blue-500 dark:text-blue-400 border-blue-500 dark:border-blue-400"}>
                            {"Schema"}
                          </button>
                          <button className={"px-3 py-2 text-[10px] border-b-2 text-neutral-500 dark:text-neutral-400 border-transparent hover:text-neutral-700 dark:hover:text-neutral-300"}>
                            {"Details"}
                          </button>
                          <button className={"px-3 py-2 text-[10px] border-b-2 text-neutral-500 dark:text-neutral-400 border-transparent hover:text-neutral-700 dark:hover:text-neutral-300"}>
                            {"Preview"}
                          </button>
                        </div>
                        <div className={"flex items-center gap-2 px-3 py-2 border-b border-neutral-200 dark:border-neutral-800"}>
                          <svg xmlns={"http://www.w3.org/2000/svg"} width={"1em"} height={"1em"} fill={"currentColor"} viewBox={"0 0 256 256"} className={"w-3 h-3 text-neutral-400 dark:text-neutral-500"}>
                            <path d={"M230.6,49.53A15.81,15.81,0,0,0,216,40H40A16,16,0,0,0,28.19,66.76l.08.09L96,139.17V216a16,16,0,0,0,24.87,13.32l32-21.34A16,16,0,0,0,160,194.66V139.17l67.74-72.32.08-.09A15.8,15.8,0,0,0,230.6,49.53ZM40,56h0Zm106.18,74.58A8,8,0,0,0,144,136v58.66L112,216V136a8,8,0,0,0-2.16-5.47L40,56H216Z"} />
                          </svg>
                          <span className={"text-[10px] text-neutral-500 dark:text-neutral-400"}>
                            {"Filter"}
                          </span>
                          <span className={"text-[10px] text-neutral-400 dark:text-neutral-600"}>
                            {"Enter property name or value"}
                          </span>
                        </div>
                        <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200 dark:border-neutral-800 text-[9px] text-neutral-500 dark:text-neutral-400"}>
                          <div className={"flex items-center"}>
                            <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                          </div>
                          <div>
                            {"Field name"}
                          </div>
                          <div>
                            {"Type"}
                          </div>
                          <div>
                            {"Mode"}
                          </div>
                        </div>
                        <div className={"flex flex-col"}>
                          <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                            <div className={"flex items-center"}>
                              <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                            </div>
                            <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                              {"block_slot"}
                            </div>
                            <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                              {"INTEGER"}
                            </div>
                            <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                              {"NULLABLE"}
                            </div>
                          </div>
                          <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                            <div className={"flex items-center"}>
                              <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                            </div>
                            <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                              {"block_hash"}
                            </div>
                            <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                              {"STRING"}
                            </div>
                            <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                              {"NULLABLE"}
                            </div>
                          </div>
                          <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                            <div className={"flex items-center"}>
                              <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                            </div>
                            <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                              {"block_height"}
                            </div>
                            <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                              {"INTEGER"}
                            </div>
                            <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                              {"NULLABLE"}
                            </div>
                          </div>
                          <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                            <div className={"flex items-center"}>
                              <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                            </div>
                            <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                              {"block_timestamp"}
                            </div>
                            <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                              {"TIMESTAMP"}
                            </div>
                            <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                              {"NULLABLE"}
                            </div>
                          </div>
                          <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                            <div className={"flex items-center"}>
                              <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                            </div>
                            <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                              {"parent_slot"}
                            </div>
                            <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                              {"INTEGER"}
                            </div>
                            <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                              {"NULLABLE"}
                            </div>
                          </div>
                          <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                            <div className={"flex items-center"}>
                              <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                            </div>
                            <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                              {"previous_block_hash"}
                            </div>
                            <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                              {"STRING"}
                            </div>
                            <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                              {"NULLABLE"}
                            </div>
                          </div>
                          <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                            <div className={"flex items-center"}>
                              <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                            </div>
                            <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                              {"total_transaction_count"}
                            </div>
                            <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                              {"INTEGER"}
                            </div>
                            <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                              {"NULLABLE"}
                            </div>
                          </div>
                          <div className={"grid grid-cols-[24px_1fr_80px_70px] gap-0 px-3 py-1.5 border-b border-neutral-200/50 dark:border-neutral-800/50 text-[10px] hover:bg-neutral-100/50 dark:hover:bg-neutral-800/30"}>
                            <div className={"flex items-center"}>
                              <input type={"checkbox"} className={"w-3 h-3 rounded border-neutral-300 dark:border-neutral-600 bg-transparent"} readOnly />
                            </div>
                            <div className={"text-neutral-700 dark:text-neutral-300 font-mono text-[9px] truncate"}>
                              {"successful_transaction_count"}
                            </div>
                            <div className={"text-neutral-500 dark:text-neutral-400 font-mono text-[9px]"}>
                              {"INTEGER"}
                            </div>
                            <div className={"text-neutral-500 dark:text-neutral-400 text-[9px]"}>
                              {"NULLABLE"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
