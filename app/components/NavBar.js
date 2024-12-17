import React from 'react'

const NavBar = () => {
  return (
    <div><div className=""> 
    <div className="navbar bg-black">
<div className="flex-1">
  <a className="btn btn-ghost text-xl">TheMealDB</a>
</div>
<div className="flex-none gap-2">
  <div className="form-control">
    <input type="text" placeholder="Search" className="input input-bordered w-24 md:w-auto" />
  </div>
    <button className="btn">🔍</button>
  <div className="flex-none">
  <div className="dropdown dropdown-end">
    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
      <div className="indicator">
      <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    height="30"
    width="30"
    viewBox="0 0 501.28 501.28"
    xmlSpace="preserve"
  >
    <g>
      <polygon
        style={{ fill: "#FFCD00" }}
        points="501.28,194.37 335.26,159.33 250.64,12.27 250.64,419.77 405.54,489.01 387.56,320.29"
      />
      <polygon
        style={{ fill: "#FFDA44" }}
        points="166.02,159.33 0,194.37 113.72,320.29 95.74,489.01 250.64,419.77 250.64,12.27"
      />
    </g>
  </svg>
      </div>
    </div></div></div>

    <div className="dropdown dropdown-end">
    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
      <div className="w-10 rounded-full">
        <img
          alt="Tailwind CSS Navbar component"
          src="https://www.svgrepo.com/show/157823/user.svg" />
      </div>
    </div>
    <ul
      tabIndex={0}
      className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
      <li>
        <a className="justify-between">
          Profile
          <span className="badge">New</span>
        </a>
      </li>
      <li><a>Settings</a></li>
      <li><a>Logout</a></li>
    </ul>
  </div>
</div>
    </div>
  </div></div>
  )
}

export default NavBar