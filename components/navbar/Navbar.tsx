import NavSearch from "./NavSearch";
import LinksDropdown from "./LinksDropdown";
import DarkMode from "./DarkMode";
import Logo from "./Logo";
import NavMenu from "./NavMenu";

import MemberNavbar from "./MemberNavbar";
import AdminNavbar from "./AdminNavbar";
import MarketingNavbar from "./MarketingNavbar";

function Navbar() {
	return (
		<nav
			className="sticky top-0 border-b z-50 transition-colors duration-300
      bg-white dark:bg-black">
			<div
				className="container flex flex-col sm:flex-row
        sm:justify-between sm:items-center flex-wrap gap-4 py-8">
				<div className="flex justify-center sm:justify-start w-full sm:w-auto">
					<Logo />
				</div>

				<NavSearch />

				<div className="flex flex-col items-center w-full sm:w-auto">
					<div className="flex items-center gap-4">
						<NavMenu />
						<DarkMode />
						<LinksDropdown />
					</div>
				</div>
			</div>
			<MemberNavbar />
			<MarketingNavbar />
			<AdminNavbar />
		</nav>
	);
}

export default Navbar;
