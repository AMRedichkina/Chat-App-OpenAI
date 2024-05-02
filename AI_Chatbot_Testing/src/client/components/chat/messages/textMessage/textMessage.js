import React from 'react';
import { Comment, Icon } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';

import './textMessage.css';
import botAvatar from '../../../../public/avatar_1.png';
import botUser from '../../../../public/avatar_2.png';
import { removeMessage } from '../../../../store/slices/messageSlice';

const TextMessage = React.memo(({ msg }) => {
  const dispatch = useDispatch();
    
  const handleDelete = () => {
      dispatch(removeMessage({ id: msg.id }));
  };

  return (
    <Comment className={msg.from === 'You' ? 'user-message' : 'bot-message'}>
        <Comment.Avatar src={msg.from === 'You' ? botUser : botAvatar} className="avatar-image"/>
        <Comment.Content className="message-bubble">
            <Comment.Text>
                {msg.text}
                <Icon name='delete' onClick={handleDelete} className="delete-icon-text" />
            </Comment.Text>
        </Comment.Content>
    </Comment>
);
});

export default TextMessage;
