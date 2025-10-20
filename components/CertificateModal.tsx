import React, { useState } from 'react';
import { jsPDF } from 'jspdf';
import { SmaiFlowIconGold, DownloadIcon, LockIcon } from './IconComponents';
import { PlanAnalysis, PlanType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  planAnalysis: PlanAnalysis;
  planType: PlanType;
  isSubscribed: boolean;
  certificatePaid: boolean;
  onInitiatePayment: () => void;
}

const SMAIFLOW_LOGO_FULL_SVG = `<svg width="1421" height="1208" viewBox="0 0 1421 1208" fill="none" xmlns="http://www.w3.org/2000/svg"><g filter="url(#f0)"><path d="M641.461 105.172L374.19 1060.77L397.102 670.007L322.303 670.007L502.568 29.1331L641.461 105.172Z" fill="url(#p0)"/></g><g filter="url(#f1)"><path d="M826.955 208.727L575.825 1058.57L623.279 667.103L547.028 667.103L688.061 132.688L826.955 208.727Z" fill="url(#p1)"/></g><g filter="url(#f2)"><path d="M1013.51 311.359L773.019 1059.49L823.177 668.018L752.908 668.018L874.617 235.32L1013.51 311.359Z" fill="url(#p2)"/></g><g filter="url(#f3)"><path d="M1204.19 416.517L982.162 1058.57L1044.9 665.73L975.211 665.73L1065.29 340.479L1204.19 416.517Z" fill="url(#p3)"/></g><g filter="url(#f4)"><path d="M959.05 1183L925 1078H955.6L984.25 1168.9H968.8L998.95 1078H1026.25L1054.75 1168.9H1039.9L1069.45 1078H1097.8L1063.75 1183H1031.95L1007.65 1105.75H1016.2L990.85 1183H959.05Z" fill="url(#p4)"/></g><g filter="url(#f5)"><path d="M524.726 1081.3L557.792 1186.61L527.193 1186.33L499.395 1095.16L514.845 1095.31L483.845 1185.92L456.546 1185.66L428.898 1094.5L443.748 1094.64L413.348 1185.26L385 1185L420.031 1080.32L451.829 1080.62L475.405 1158.09L466.856 1158.01L492.928 1081L524.726 1081.3Z" fill="url(#p5)"/></g><g filter="url(#f6)"><path d="M880.35 1187.2C871.95 1187.2 864.2 1185.85 857.1 1183.15C850 1180.45 843.8 1176.65 838.5 1171.75C833.3 1166.75 829.25 1160.95 826.35 1154.35C823.45 1147.75 822 1140.5 822 1132.6C822 1124.7 823.45 1117.45 826.35 1110.85C829.25 1104.25 833.3 1098.5 838.5 1093.6C843.8 1088.6 850 1084.75 857.1 1082.05C864.2 1079.35 871.95 1078 880.35 1078C888.85 1078 896.6 1079.35 903.6 1082.05C910.7 1084.75 916.85 1088.6 922.05 1093.6C927.25 1098.5 931.3 1104.25 934.2 1110.85C937.2 1117.45 938.7 1124.7 938.7 1132.6C938.7 1140.5 937.2 1147.8 934.2 1154.5C931.3 1161.1 927.25 1166.85 922.05 1171.75C916.85 1176.65 910.7 1180.45 903.6 1183.15C896.6 1185.85 888.85 1187.2 880.35 1187.2ZM880.35 1162.6C884.35 1162.6 888.05 1161.9 891.45 1160.5C894.95 1159.1 897.95 1157.1 900.45 1154.5C903.05 1151.8 905.05 1148.6 906.45 1144.9C907.95 1141.2 908.7 1137.1 908.7 1132.6C908.7 1128 907.95 1123.9 906.45 1120.3C905.05 1116.6 903.05 1113.45 900.45 1110.85C897.95 1108.15 894.95 1106.1 891.45 1104.7C888.05 1103.3 884.35 1102.6 880.35 1102.6C876.35 1102.6 872.6 1103.3 869.1 1104.7C865.7 1106.1 862.7 1108.15 860.1 1110.85C857.6 1113.45 855.6 1116.6 854.1 1120.3C852.7 1123.9 852 1128 852 1132.6C852 1137.1 852.7 1141.2 854.1 1144.9C855.6 1148.6 857.6 1151.8 860.1 1154.5C862.7 1157.1 865.7 1159.1 869.1 1160.5C872.6 1161.9 876.35 1162.6 880.35 1162.6Z" fill="url(#p6)"/></g><g filter="url(#f7)"><path d="M792 1187V1082H821.7V1163.45H871.8V1187H792Z" fill="url(#p7)"/></g><g filter="url(#f8)"><path d="M737.6 1128.05H786.05V1151H737.6V1128.05ZM739.7 1187H710V1082H792.35V1104.95H739.7V1187Z" fill="url(#p8)"/></g><g filter="url(#f9)"><path d="M675 1200V1061H705V1200H675Z" fill="url(#p9)"/></g><g filter="url(#f10)"><path d="M558 1187L604.35 1082H633.6L680.1 1187H649.2L612.9 1096.55H624.6L588.3 1187H558ZM583.35 1166.6L591 1144.7H642.3L649.95 1166.6H583.35Z" fill="url(#p10)"/></g><g filter="url(#f11)"><path d="M347.25 1187.2C338.65 1187.2 330.35 1186.15 322.35 1184.05C314.45 1181.85 308 1179.05 303 1175.65L312.75 1153.75C317.45 1156.75 322.85 1159.25 328.95 1161.25C335.15 1163.15 341.3 1164.1 347.4 1164.1C351.5 1164.1 354.8 1163.75 357.3 1163.05C359.8 1162.25 361.6 1161.25 362.7 1160.05C363.9 1158.75 364.5 1157.25 364.5 1155.55C364.5 1153.15 363.4 1151.25 361.2 1149.85C359 1148.45 356.15 1147.3 352.65 1146.4C349.15 1145.5 345.25 1144.6 340.95 1143.7C336.75 1142.8 332.5 1141.65 328.2 1140.25C324 1138.85 320.15 1137.05 316.65 1134.85C313.15 1132.55 310.3 1129.6 308.1 1126C305.9 1122.3 304.8 1117.65 304.8 1112.05C304.8 1105.75 306.5 1100.05 309.9 1094.95C313.4 1089.85 318.6 1085.75 325.5 1082.65C332.4 1079.55 341 1078 351.3 1078C358.2 1078 364.95 1078.8 371.55 1080.4C378.25 1081.9 384.2 1084.15 389.4 1087.15L380.25 1109.2C375.25 1106.5 370.3 1104.5 365.4 1103.2C360.5 1101.8 355.75 1101.1 351.15 1101.1C347.05 1101.1 343.75 1101.55 341.25 1102.45C338.75 1103.25 336.95 1104.35 335.85 1105.75C334.75 1107.15 334.2 1108.75 334.2 1110.55C334.2 1112.85 335.25 1114.7 337.35 1116.1C339.55 1117.4 342.4 1118.5 345.9 1119.4C349.5 1120.2 353.4 1121.05 357.6 1121.95C361.9 1122.85 366.15 1124 370.35 1125.4C374.65 1126.7 378.55 1128.5 382.05 1130.8C385.55 1133 388.35 1135.95 390.45 1139.65C392.65 1143.25 393.75 1147.8 393.75 1153.3C393.75 1159.4 392 1165.05 388.5 1170.25C385.1 1175.35 379.95 1179.45 373.05 1182.55C366.25 1185.65 357.65 1187.2 347.25 1187.2Z" fill="url(#p11)"/></g><defs><filter id="f0" x="318.303" y="29.1333" width="327.158" height="1039.64" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="e1"/><feBlend mode="normal" in="SourceGraphic" in2="e1" result="s"/></filter><filter id="f1" x="543.028" y="132.688" width="287.926" height="933.886" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="e1"/><feBlend mode="normal" in="SourceGraphic" in2="e1" result="s"/></filter><filter id="f2" x="748.908" y="235.32" width="268.603" height="832.169" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="e1"/><feBlend mode="normal" in="SourceGraphic" in2="e1" result="s"/></filter><filter id="f3" x="971.211" y="340.479" width="236.975" height="726.095" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="e1"/><feBlend mode="normal" in="SourceGraphic" in2="e1" result="s"/></filter><filter id="f4" x="921" y="1078" width="180.8" height="113" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="e1"/><feBlend mode="normal" in="SourceGraphic" in2="e1" result="s"/></filter><filter id="f5" x="381" y="1080.32" width="180.792" height="114.294" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="e1"/><feBlend mode="normal" in="SourceGraphic" in2="e1" result="s"/></filter><filter id="f6" x="818" y="1078" width="124.7" height="117.2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="e1"/><feBlend mode="normal" in="SourceGraphic" in2="e1" result="s"/></filter><filter id="f7" x="788" y="1082" width="87.7998" height="113" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="e1"/><feBlend mode="normal" in="SourceGraphic" in2="e1" result="s"/></filter><filter id="f8" x="706" y="1082" width="90.3496" height="113" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="e1"/><feBlend mode="normal" in="SourceGraphic" in2="e1" result="s"/></filter><filter id="f9" x="671" y="1061" width="38" height="147" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="e1"/><feBlend mode="normal" in="SourceGraphic" in2="e1" result="s"/></filter><filter id="f10" x="554" y="1082" width="130.1" height="113" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="e1"/><feBlend mode="normal" in="SourceGraphic" in2="e1" result="s"/></filter><filter id="f11" x="299" y="1078" width="98.75" height="117.2" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/><feOffset dy="4"/><feGaussianBlur stdDeviation="2"/><feComposite in2="hardAlpha" operator="out"/><feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.35 0"/><feBlend mode="normal" in2="BackgroundImageFix" result="e1"/><feBlend mode="normal" in="SourceGraphic" in2="e1" result="s"/></filter><linearGradient id="p0" x1="759.279" y1="506.784" x2="220.381" y2="733.684" gradientUnits="userSpaceOnUse"><stop stop-color="#8C6014"/><stop offset=".24" stop-color="#D4AF37"/><stop offset=".32" stop-color="#FFFAD5"/><stop offset=".54" stop-color="#D4AF37"/></linearGradient><linearGradient id="p1" x1="927.729" y1="559.021" x2="437.733" y2="765.294" gradientUnits="userSpaceOnUse"><stop stop-color="#8C6014"/><stop offset=".24" stop-color="#D4AF37"/><stop offset=".32" stop-color="#FFFAD5"/><stop offset=".54" stop-color="#D4AF37"/></linearGradient><linearGradient id="p2" x1="1097.23" y1="611.647" x2="650.354" y2="799.696" gradientUnits="userSpaceOnUse"><stop stop-color="#8C6014"/><stop offset=".24" stop-color="#D4AF37"/><stop offset=".32" stop-color="#FFFAD5"/><stop offset=".54" stop-color="#D4AF37"/></linearGradient><linearGradient id="p3" x1="1271.11" y1="665.632" x2="875.116" y2="832.236" gradientUnits="userSpaceOnUse"><stop stop-color="#8C6014"/><stop offset=".24" stop-color="#D4AF37"/><stop offset=".32" stop-color="#FFFAD5"/><stop offset=".54" stop-color="#D4AF37"/></linearGradient><linearGradient id="p4" x1="927.935" y1="1062.89" x2="1096.37" y2="1065.53" gradientUnits="userSpaceOnUse"><stop stop-color="#8C6014"/><stop offset=".24" stop-color="#D4AF37"/><stop offset=".67" stop-color="#FFFAD5"/><stop offset="1" stop-color="#D4AF37"/></linearGradient><linearGradient id="p5" x1="554.716" y1="1201.69" x2="386.308" y2="1197.48" gradientUnits="userSpaceOnUse"><stop stop-color="#8C6014"/><stop offset=".24" stop-color="#D4AF37"/><stop offset=".67" stop-color="#FFFAD5"/><stop offset="1" stop-color="#D4AF37"/></linearGradient><linearGradient id="p6" x1="823.982" y1="1062.29" x2="937.754" y2="1063.45" gradientUnits="userSpaceOnUse"><stop stop-color="#8C6014"/><stop offset=".24" stop-color="#D4AF37"/><stop offset=".67" stop-color="#FFFAD5"/><stop offset="1" stop-color="#D4AF37"/></linearGradient><linearGradient id="p7" x1="793.355" y1="1066.89" x2="871.157" y2="1067.45" gradientUnits="userSpaceOnUse"><stop stop-color="#8C6014"/><stop offset=".24" stop-color="#D4AF37"/><stop offset=".67" stop-color="#FFFAD5"/><stop offset="1" stop-color="#D4AF37"/></linearGradient><linearGradient id="p8" x1="711.399" y1="1066.89" x2="791.686" y2="1067.49" gradientUnits="userSpaceOnUse"><stop stop-color="#8C6014"/><stop offset=".24" stop-color="#D4AF37"/><stop offset=".67" stop-color="#FFFAD5"/><stop offset="1" stop-color="#D4AF37"/></linearGradient><linearGradient id="p9" x1="675.51" y1="1041" x2="704.76" y2="1041.06" gradientUnits="userSpaceOnUse"><stop stop-color="#8C6014"/><stop offset=".24" stop-color="#D4AF37"/><stop offset=".67" stop-color="#FFFAD5"/><stop offset="1" stop-color="#D4AF37"/></linearGradient><linearGradient id="p10" x1="560.074" y1="1066.89" x2="679.108" y2="1068.21" gradientUnits="userSpaceOnUse"><stop stop-color="#8C6014"/><stop offset=".24" stop-color="#D4AF37"/><stop offset=".67" stop-color="#FFFAD5"/><stop offset="1" stop-color="#D4AF37"/></linearGradient><linearGradient id="p11" x1="304.541" y1="1062.29" x2="393.018" y2="1062.99" gradientUnits="userSpaceOnUse"><stop stop-color="#8C6014"/><stop offset=".24" stop-color="#D4AF37"/><stop offset=".67" stop-color="#FFFAD5"/><stop offset="1" stop-color="#D4AF37"/></linearGradient></defs></svg>`;

type CertificateStat = 'duration' | 'hours' | 'distance' | 'pace';

const CertificateModal: React.FC<Props> = ({ isOpen, onClose, userName, planAnalysis, planType, isSubscribed, certificatePaid, onInitiatePayment }) => {
    const { planDurationDays, totalHours, totalDistanceKm, averagePaceMinPerKm } = planAnalysis;
    
    const [isDownloading, setIsDownloading] = useState(false);
    const [includedStats, setIncludedStats] = useState<Set<CertificateStat>>(
        () => new Set(['duration', 'hours', 'distance', ...(averagePaceMinPerKm ? ['pace'] : [])] as CertificateStat[])
    );

    const isFreePlan = planType === 'free';
    const canDownload = !isFreePlan || isSubscribed || certificatePaid;

    if (!isOpen) return null;

    const toggleStat = (stat: CertificateStat) => {
        setIncludedStats(prev => {
            const newSet = new Set(prev);
            if (newSet.has(stat)) {
                newSet.delete(stat);
            } else {
                newSet.add(stat);
            }
            return newSet;
        });
    };

    const formatPace = (pace: number | null): string => {
        if (pace === null || pace <= 0) return 'N/A';
        const minutes = Math.floor(pace);
        const seconds = Math.round((pace - minutes) * 60);
        return `${minutes}'${String(seconds).padStart(2, '0')}"/km`;
    };

    const handleDownloadPdf = async () => {
        setIsDownloading(true);
        try {
            const doc = new jsPDF({
                orientation: 'landscape',
                unit: 'pt',
                format: 'letter'
            });

            const svgToPngDataURL = (svgString: string, width: number, height: number): Promise<string> => {
                return new Promise((resolve, reject) => {
                    const canvas = document.createElement('canvas');
                    const scale = 4; // High resolution for crisp PDF
                    canvas.width = width * scale;
                    canvas.height = height * scale;
                    const ctx = canvas.getContext('2d');
                    if (!ctx) return reject('Canvas context failed');
                    
                    const img = new Image();
                    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
                    const url = URL.createObjectURL(svgBlob);

                    img.onload = () => {
                        ctx.imageSmoothingQuality = 'high';
                        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                        URL.revokeObjectURL(url);
                        resolve(canvas.toDataURL('image/png'));
                    };
                    img.onerror = () => reject('SVG to PNG conversion failed');
                    img.src = url;
                });
            };
            
            const logoPngUrl = await svgToPngDataURL(SMAIFLOW_LOGO_FULL_SVG, 200, 200);

            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();

            // Background & Border
            doc.setFillColor('#FDFBF5');
            doc.rect(0, 0, pageWidth, pageHeight, 'F');
            doc.setDrawColor('#D4AF37');
            doc.setLineWidth(5);
            doc.rect(20, 20, pageWidth - 40, pageHeight - 40);
            doc.setLineWidth(1);
            doc.rect(28, 28, pageWidth - 56, pageHeight - 56);

            // Logo
            doc.addImage(logoPngUrl, 'PNG', pageWidth / 2 - 75, 50, 150, 150 * (1208/1421));

            // Titles
            doc.setFont('times', 'normal');
            doc.setFontSize(18);
            doc.setTextColor('#a97f2a');
            doc.text('Certificado de Logro', pageWidth / 2, 200, { align: 'center' });

            doc.setFontSize(14);
            doc.setTextColor('#6b5b3b');
            doc.text('Otorgado a', pageWidth / 2, 240, { align: 'center' });

            // User Name
            doc.setFont('times', 'bold');
            doc.setFontSize(48);
            doc.setTextColor('#8C6014');
            doc.text(userName, pageWidth / 2, 295, { align: 'center' });

            // Body Text with dynamic goal - UPDATED LAYOUT
            let yPos = 340;
            
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            doc.setTextColor('#4A4A4A');

            const textPart1 = 'Por completar con éxito un plan de entrenamiento personalizado de SmaiFlow para:';
            doc.text(textPart1, pageWidth / 2, yPos, { align: 'center' });
            
            yPos += 35; // Space for the goal text

            // Goal Text - larger and on its own line
            const goalText = planAnalysis.goalDistances || 'tu objetivo';
            doc.setFont('times', 'bolditalic');
            doc.setFontSize(22); // Making it larger as requested
            doc.setTextColor('#8C6014'); // Gold color
            doc.text(goalText, pageWidth / 2, yPos, { align: 'center' });

            yPos += 30; // Space after the goal text

            // Last line of text
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(11);
            doc.setTextColor('#4A4A4A');
            const textPart2 = 'demostrando dedicación, constancia y un compromiso inquebrantable con la grandeza.';
            doc.text(textPart2, pageWidth / 2, yPos, { align: 'center' });
            
            // Stats Section
            const stats = [
                { id: 'duration', label: 'Duración del Plan', value: `${planDurationDays} Días` },
                { id: 'hours', label: 'Horas Entrenadas', value: `${totalHours} Horas` },
                { id: 'distance', label: 'Distancia Total', value: `${totalDistanceKm.toFixed(1)} km` },
                { id: 'pace', label: 'Ritmo Promedio', value: formatPace(averagePaceMinPerKm) }
            ].filter(stat => includedStats.has(stat.id as CertificateStat));
            
            if (stats.length > 0) {
                const statY = yPos + 60; // Adjusted Y position for stats
                const colWidth = pageWidth / (stats.length + 1);
                stats.forEach((stat, index) => {
                    const x = colWidth * (index + 1);
                    doc.setFont('helvetica', 'bold');
                    doc.setFontSize(14);
                    doc.setTextColor('#8C6014');
                    doc.text(stat.label, x, statY, { align: 'center' });
                    doc.setFont('helvetica', 'normal');
                    doc.setFontSize(20);
                    doc.setTextColor('#333333');
                    doc.text(stat.value, x, statY + 25, { align: 'center' });
                });
            }
            
            // Footer
            doc.setFont('helvetica', 'italic');
            doc.setFontSize(10);
            doc.setTextColor('#a97f2a');
            const issueDate = new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
            doc.text(`Emitido el ${issueDate}`, pageWidth / 2, pageHeight - 50, { align: 'center' });


            doc.save(`Certificado-SmaiFlow-${userName.replace(/\s/g, '_')}.pdf`);
        } catch(error) {
            console.error("Error generating PDF:", error);
            alert("Hubo un error al generar el PDF. Por favor, inténtalo de nuevo.");
        } finally {
            setIsDownloading(false);
        }
    };

    const statsOptions: { id: CertificateStat; label: string; value: string | number }[] = [
        { id: 'duration', label: 'Duración del Plan', value: `${planDurationDays} días` },
        { id: 'hours', label: 'Horas Entrenadas', value: totalHours },
        { id: 'distance', label: 'Distancia Total', value: `${totalDistanceKm.toFixed(1)} km` },
    ];
    if (averagePaceMinPerKm) {
        statsOptions.push({ id: 'pace', label: 'Ritmo Promedio', value: formatPace(averagePaceMinPerKm) });
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-2xl animate-fade-in-up">
                <div className="p-6 sm:p-8 text-center">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center bg-amber-100 dark:bg-slate-700 rounded-full mb-4 border-2 border-amber-300">
                        <SmaiFlowIconGold className="w-10 h-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-amber-950 dark:text-slate-100">¡Felicitaciones, {userName}! 🎉</h3>
                    <p className="mt-2 text-amber-800 dark:text-slate-300">
                        Has completado tu plan de entrenamiento con una adherencia y un estado de flow excepcionales. ¡Estamos orgullosos de tu dedicación!
                    </p>
                    
                     <div className="mt-6 p-4 bg-amber-50 dark:bg-slate-700/50 rounded-lg border border-amber-200 dark:border-slate-600 space-y-4">
                        <h4 className="font-bold text-amber-900 dark:text-amber-200">Personaliza tu Certificado</h4>
                        <p className="text-xs text-amber-700 dark:text-slate-400 -mt-2">Selecciona las métricas que quieres incluir en tu certificado.</p>
                        <div className="grid grid-cols-2 gap-3 text-left">
                            {statsOptions.map(({ id, label, value }) => (
                                <label key={id} className="flex items-center gap-2 p-2 rounded-md hover:bg-amber-100 dark:hover:bg-slate-600/50 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={includedStats.has(id)}
                                        onChange={() => toggleStat(id)}
                                        className="h-4 w-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                                    />
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{label}: <span className="font-bold">{value}</span></span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
                        {canDownload ? (
                             <button
                                onClick={handleDownloadPdf}
                                disabled={isDownloading}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-transparent shadow-sm px-6 py-3 bg-amber-600 text-base font-medium text-white hover:bg-amber-700 sm:text-sm dark:bg-amber-500 dark:hover:bg-amber-600 disabled:opacity-70 disabled:cursor-wait"
                            >
                                {isDownloading ? (
                                    <>
                                     <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Generando...
                                    </>
                                ) : (
                                    <>
                                      <DownloadIcon />
                                      Descargar Certificado (PDF)
                                    </>
                                )}
                            </button>
                        ) : (
                             <button
                                onClick={onInitiatePayment}
                                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-transparent shadow-sm px-6 py-3 bg-green-600 text-base font-medium text-white hover:bg-green-700 sm:text-sm"
                            >
                                <LockIcon />
                                Desbloquear Certificado
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            type="button"
                            className="w-full sm:w-auto inline-flex justify-center rounded-xl border border-amber-300 shadow-sm px-6 py-3 bg-white text-base font-medium text-amber-800 hover:bg-amber-50 sm:text-sm dark:bg-slate-700 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-600"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateModal;