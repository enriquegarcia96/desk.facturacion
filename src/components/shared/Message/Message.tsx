import { useEffect } from 'react';
import { message } from 'antd';
import type { GetProp, MessageArgsProps } from 'antd';

const defaultStyles: GetProp<MessageArgsProps, 'styles', 'Return'> = {
  root: {
    backgroundColor: '#f6ffed',
    border: '2px solid #95de64',
    borderRadius: 16,
    boxShadow: '4px 4px 0 #d9f7be',
  },
  icon: {
    color: '#237804',
  },
  title: {
    color: '#237804',
    fontWeight: 600,
  },
};

const stylesFn: MessageArgsProps['styles'] = ({
  props,
}): GetProp<MessageArgsProps, 'styles', 'Return'> => {
  if (props.type === 'error') {
    return {
      root: {
        ...defaultStyles.root,
        backgroundColor: '#fff2f0',
        borderColor: '#ffccc7',
        boxShadow: '4px 4px 0 #ffccc7',
      },
      icon: {
        color: '#cf1322',
      },
      title: {
        color: '#cf1322',
        fontWeight: 600,
      },
    };
  }
  return defaultStyles;
};

interface Pros {
  messageToUser: string;
  typeMessage: 'success' | 'error';
  onClose?: () => void;
}

export const Message = ({messageToUser, typeMessage, onClose} : Pros) => {
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!messageToUser) return;

    messageApi.open({
      type: typeMessage,
      content: messageToUser,
      styles: typeMessage === 'success' ? defaultStyles : stylesFn,
      onClose
    });
  }, [messageToUser, typeMessage, messageApi, onClose]);

return (
  <>
    {contextHolder}
  </>
);
}
