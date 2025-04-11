import {svgToImg} from '$ui/map/utils/util'

export default [
  {name: 'default', label: '默认', style:{"brightness":1,"contrast":1,"grayscale":0,"hue-rotate":0,"opacity":1,"saturate":1,"sepia":0,"invert":0}},
  {name: 'dark', label: '黑色背景', style:{"brightness":1,"contrast":1,"grayscale":0,"hue-rotate":0,"opacity":1,"saturate":1,"sepia":0,"invert":1}},
]

export const colors = [
  '#f5222d',
  '#2f54eb',
  '#52c41a',
  '#faad14',
  '#fadb14',
  '#a0d911',
  '#13c2c2',
  '#1890ff',
  '#722ed1',
  '#eb2f96',
  '#fa541c',
  '#666666',
];

let icons = [];
let iconMap = {};

(async function(){
  if (icons.length > 0) return icons;
  for (const color of colors) {
    let svg = await svgToImg('el-icon-location', 30, color, 'element-icons');
    iconMap[color] = svg;
  }
  icons = Object.keys(iconMap).map(color => {
    return {color, img: iconMap[color]}
  })
})();

export function getIcons() {
  if (icons.length > 0) return icons;
  return [];
}

export async function getIconsAsync() {
  if (icons.length > 0) return icons;
  for (const color of colors) {
    let svg = await svgToImg('el-icon-location', 30, color, 'element-icons')
    iconMap[color] = svg;
  }
  icons = Object.keys(iconMap).map(color => {
    return {color, img: iconMap[color]}
  })
  return icons;
}

export function getIcon(color) {
  if (icons.length > 0) return icons.find(item => item.color === color).img;
  return null;
}
