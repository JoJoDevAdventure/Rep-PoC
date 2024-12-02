const Icons = {
    Account: ({ color = "black", size = 20 }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask id="mask0_2_41" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
          <rect width="20" height="20" rx="3" fill="#E5E5E5" />
        </mask>
        <g mask="url(#mask0_2_41)">
          <path
            d="M16.4508 15.2412C16.0996 14.3992..."
            fill={color}
          />
        </g>
      </svg>
    ),
  
    Cash: ({ color = "black", size = 20 }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.5">
          <mask id="mask0_2_211" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
            <rect width="20" height="20" rx="3" fill="#E5E5E5" />
          </mask>
          <g mask="url(#mask0_2_211)">
            <path
              d="M13.2437 5.74468V5.84468H..."
              fill={color}
            />
          </g>
        </g>
      </svg>
    ),
  
    CRM: ({ color = "black", size = 20 }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.5">
          <path
            d="M3.5 4H16.5L17 4.5V14.5L16.5..."
            fill={color}
          />
        </g>
      </svg>
    ),
  
    Dashboard: ({ color = "black", size = 20 }) => (
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <mask id="mask0_2_9" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
          <rect width="20" height="20" rx="3" fill="#C4C4C4" fillOpacity="0.81" />
        </mask>
        <g mask="url(#mask0_2_9)">
          <path
            d="M4.45556 5.75V5.85H..."
            fill="black"
          />
        </g>
      </svg>
    ),
  
    Help: ({ color = "black", size = 20 }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M10.0703 10.2671L10.0703..."
          fill={color}
          stroke="white"
          strokeWidth="0.2"
        />
      </svg>
    ),
  
    Logout: ({ color = "black", size = 20 }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.75 4.65H4.65V..."
          fill={color}
        />
      </svg>
    ),
  
    Listings: ({ color = "black", size = 20 }) => (
      <svg
        width={size}
        height={size}
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g opacity="0.5">
          <path
            d="M15.546 4.51372C15.518..."
            fill={color}
          />
        </g>
      </svg>
    ),
  };
  
  export default Icons;