import { useContext } from "react";
import Svg, { Path } from "react-native-svg";
import { ThemeContext } from "../../context/ThemeContext";

export default function Melios({ ...props }) {
	return (
		<Svg width="111.5" height="19.5" viewBox="0 0 223 39" fill="none">
			<Path
				d="M0.965924 38.119V37.223L5.61392 34.927L6.78992 4.35102L1.91792 2.05502V1.15902H14.3499L26.2779 28.823L38.1499 1.15902H50.0779V2.05502L45.3179 3.95902L46.2699 34.927L50.3579 37.223V38.119H35.0699V37.223L39.4379 34.983L38.8779 7.99102L25.8859 38.399H22.9739L9.98192 8.27102L9.25392 34.983L14.0139 37.223V38.119H0.965924ZM56.0402 38.119V37.223L60.7442 34.927V4.35102L56.0402 2.05502V1.15902H85.3282V10.847H84.4322L80.5682 4.23902H67.7442V17.511H76.7602L79.7842 12.751H80.6802V25.239H79.7842L76.7602 20.591H67.7442V35.039H81.9682L86.0002 27.199H86.8962V38.119H56.0402ZM93.5011 38.119V37.223L98.2051 34.927V4.35102L93.5011 2.05502V1.15902H110.469V2.05502L105.205 4.35102V35.039H118.085L122.341 24.959H123.237V38.119H93.5011ZM129.327 38.119V37.223L133.975 34.927V4.35102L129.327 2.05502V1.15902H145.679V2.05502L141.031 4.35102V34.927L145.679 37.223V38.119H129.327ZM171.119 38.679C168.394 38.679 165.874 38.2124 163.559 37.279C161.245 36.3084 159.229 34.983 157.511 33.303C155.794 31.5857 154.45 29.5697 153.479 27.255C152.546 24.9404 152.079 22.4017 152.079 19.639C152.079 16.8764 152.546 14.3377 153.479 12.023C154.45 9.70835 155.794 7.71102 157.511 6.03102C159.229 4.31368 161.245 2.98835 163.559 2.05502C165.874 1.08435 168.394 0.599018 171.119 0.599018C173.882 0.599018 176.421 1.08435 178.735 2.05502C181.05 2.98835 183.066 4.31368 184.783 6.03102C186.501 7.71102 187.826 9.70835 188.759 12.023C189.73 14.3377 190.215 16.8764 190.215 19.639C190.215 22.4017 189.73 24.9404 188.759 27.255C187.826 29.5697 186.501 31.5857 184.783 33.303C183.066 34.983 181.05 36.3084 178.735 37.279C176.421 38.2124 173.882 38.679 171.119 38.679ZM172.127 35.823C174.218 35.823 176.047 35.2257 177.615 34.031C179.221 32.8364 180.471 31.1564 181.367 28.991C182.263 26.8257 182.711 24.2684 182.711 21.319C182.711 17.6977 182.151 14.543 181.031 11.855C179.949 9.16702 178.455 7.09502 176.551 5.63902C174.685 4.14568 172.594 3.39902 170.279 3.39902C168.226 3.39902 166.378 3.99635 164.735 5.19102C163.13 6.34835 161.861 8.00968 160.927 10.175C159.994 12.3404 159.527 14.8977 159.527 17.847C159.527 21.4684 160.087 24.623 161.207 27.311C162.327 29.999 163.839 32.0897 165.743 33.583C167.685 35.0764 169.813 35.823 172.127 35.823ZM209.175 38.679C206.786 38.679 204.695 38.455 202.903 38.007C201.149 37.5217 199.394 36.831 197.639 35.935L197.079 26.583H198.087L201.503 33.023C203.818 34.927 206.245 35.879 208.783 35.879C210.874 35.879 212.554 35.375 213.823 34.367C215.093 33.3217 215.727 31.847 215.727 29.943C215.727 28.5244 215.391 27.3857 214.719 26.527C214.085 25.631 213.095 24.8284 211.751 24.119C210.407 23.3724 208.653 22.5137 206.487 21.543C203.874 20.2737 201.858 18.911 200.439 17.455C199.021 15.9617 198.311 13.9644 198.311 11.463C198.311 10.0444 198.666 8.68168 199.375 7.37502C200.085 6.06835 201.018 4.91102 202.175 3.90302C203.37 2.89502 204.695 2.09235 206.151 1.49502C207.645 0.897684 209.175 0.599018 210.743 0.599018C212.61 0.599018 214.346 0.823017 215.951 1.27102C217.594 1.68168 219.162 2.27902 220.655 3.06302L221.215 12.023H220.263L216.847 5.86302C215.765 5.04168 214.757 4.42568 213.823 4.01502C212.89 3.60435 211.826 3.39902 210.631 3.39902C209.063 3.39902 207.757 3.92168 206.711 4.96702C205.703 6.01235 205.199 7.33768 205.199 8.94302C205.199 10.623 205.759 11.9857 206.879 13.031C207.999 14.039 209.866 15.159 212.479 16.391C214.757 17.4364 216.623 18.463 218.079 19.471C219.535 20.479 220.618 21.6177 221.327 22.887C222.037 24.1564 222.391 25.7244 222.391 27.591C222.391 29.383 221.999 30.9697 221.215 32.351C220.469 33.695 219.442 34.8524 218.135 35.823C216.866 36.7564 215.447 37.4657 213.879 37.951C212.311 38.4364 210.743 38.679 209.175 38.679Z"
				fill={props.fill}
			/>
		</Svg>
	);
}
