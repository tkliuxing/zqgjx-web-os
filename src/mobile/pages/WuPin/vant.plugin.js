import Vue from "vue";
import { ContactCard } from "vant";
import { Button } from "vant";
import { NavBar } from "vant";
import { Search } from "vant";
import { CellGroup } from "vant";
import { Cell } from "vant";
import { Dialog } from "vant";
import { Form } from "vant";
import { Field } from "vant";
import { Toast } from "vant";
import { Picker } from "vant";
import { Popup } from "vant";
import { Calendar } from "vant";
import { RadioGroup } from "vant";
import { Radio } from "vant";
import { Step, Steps } from 'vant';
import { GoodsAction, GoodsActionIcon, GoodsActionButton } from "vant";
let components = [
  ContactCard,
  Button,
  NavBar,
  Search,
  CellGroup,
  Cell,
  Dialog,
  Form,
  Field,
  Popup,
  Picker,
  Calendar,
  RadioGroup,
  Radio,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton,
  Step,
  Steps,
  Toast
];

components.forEach((comp) => {
  Vue.use(comp);
});
import "vant/lib/index.css";
