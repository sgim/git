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
  return this.id === id ? this.next : new ListNode(this.value, this.next && this.next.remove(id));
};

ListNode.prototype.splitAt = function (id) {
  return this.id !== id && new ListNode(this.value, this.next && this.next.splitAt(id));
};

ListNode.prototype.find = function (id) {
  return this.id === id ? this : (this.next && this.next.find(id));
};

ListNode.prototype.insertAt = function (id, list) {
  return id !== this.id ? this.splitAt(id).append(list).append(this.find(id)) : list.append(this);
};

ListNode.prototype.commonAncestor = function (list) {
  return list.find(this.id) || (this.next && this.next.commonAncestor(list));
};

module.exports = { util: util, ListNode: ListNode };
