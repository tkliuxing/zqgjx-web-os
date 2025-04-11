import Vue from "vue";

let methods = {
  setList(obj) {
    store.list.push(obj);
  },
  clearList() {
    store.list = [];
  },
  category(category) {
    store.category = category;
  },
  delItem(index) {
    store.list.splice(index, 1);
  },
};

export const store = Vue.observable({
  list: [],
  category: "",
});

export const commit = function(methodsName, payload) {
  methods[methodsName](payload);
};
