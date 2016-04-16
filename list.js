'use strict';

const crypto = require('crypto');

const util = {
  getSha1: (data) => crypto.createHash("sha1").update(data).digest("hex")
};

function ListNode (value, next) {
  this.value = value;
  this.next = next || null;
	this.id = util.getSha1(this.value);
}

ListNode.prototype.toString = function () {
  var node = this;
  var arr = "[";
  while (node) {
    arr += node.id;
    (node = node.next) && (arr += " ");
  }
  return arr + "]";
};

ListNode.prototype.toStringShort = function () {
  var node = this;
  var arr = "[";
  while (node) {
    arr += node.id.slice(0, 6);
    (node = node.next) && (arr += " ");
  }
  return arr + "]";
};

ListNode.prototype.length = function () {
  var len = 1;
  var node = this.next;
  while(node) {
    len++;
    node = node.next;
  }
  return len;
};

ListNode.prototype.shiftNode = function (val) {
  return new ListNode(val, this);
};

ListNode.prototype.append = function (list) {
  return new ListNode(this.value, this.next ? this.next.append(list): list);
};

ListNode.prototype.remove = function (id) {
  if(this.id === id) {

  } else {
    return this.append(null);
  }
};

module.exports = { util: util, ListNode: ListNode };
