import React from 'react';
import { Comment, Icon } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';

import './textMessage.css';
import botAvatar from '../../../../public/avatar_1.png';
import botUser from '../../../../public/avatar_2.png';
import { removeMessage } from '../../../../store/slices/messageSlice';

/**
 * A memoized component for displaying a text message.
 * 
 * This component renders a text message along with a delete icon. 
 * It allows users to delete their own messages.
 * 
 * @param {Object} msg - The message object containing message data.
 * @returns {JSX.Element} The text message component.
 */
const TextMessage = React.memo(({ msg }) => {
    const dispatch = useDispatch();

    const handleDelete = () => {
        dispatch(removeMessage({ id: msg.id }));
    };
    const messageClass = msg.from === 'You' ? 'chat__user chat__user-message' : 'chat__bot chat__bot-message';

    return (
        <Comment className={`${messageClass}`}>
            <Comment.Avatar src={msg.from === 'You' ? botUser : botAvatar} className="message__avatar-image" />
            <Comment.Content className="message__bubble">
                <Comment.Text >
                    {msg.text}
                    <Icon name='delete' data-testid='delete-icon-text' onClick={handleDelete} className="message__delete-icon" />
                </Comment.Text>
            </Comment.Content>
        </Comment>
    );
});

export default TextMessage;
