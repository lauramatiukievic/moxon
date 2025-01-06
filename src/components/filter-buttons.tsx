"use client"

import { Squares2X2Icon, FunnelIcon } from "@heroicons/react/24/outline"
import { useMobileContext } from "./mobileContext"

function FilterButtons({ setMobileFiltersOpen }: { setMobileFiltersOpen: (open: boolean) => void }) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={() => setMobileFiltersOpen(true)}
        className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 md:hidden"
      >
        <span className="sr-only">Filters</span>
        <FunnelIcon aria-hidden="true" className="h-5 w-5" />
      </button>
    </div>
  );
}
export default FilterButtons