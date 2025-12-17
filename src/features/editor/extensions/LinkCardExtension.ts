//File nay hien tai khong dung den

import { Node, mergeAttributes } from '@tiptap/core';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { LinkCardView } from '../components/LinkCardView';

export default Node.create({
  name: 'linkCard',

  group: 'block', // Nó là một khối dòng (như paragraph), không phải inline

  atom: true, // Nó là một đơn vị nguyên tử, không thể chia nhỏ

  addAttributes() {
    return {
      href: {
        default: null,
      },
      title: {
        default: 'No Title',
      },
      description: {
        default: 'No description available',
      },
      image: {
        default: '',
      },
      domain: {
        default: '',
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'link-card',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return ['link-card', mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(LinkCardView);
  },
});