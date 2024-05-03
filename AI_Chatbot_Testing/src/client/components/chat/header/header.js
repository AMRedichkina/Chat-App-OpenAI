import React, { useState } from 'react';
import { Container, Icon, Dropdown } from 'semantic-ui-react';
import { useDispatch } from 'react-redux';

import './header.css';
import { clearMessages } from '../../../store/slices/messageSlice';


/**
 * A memoized component representing the header of the chat interface.
 * 
 * This component includes options to add hashtags and clear messages.
 * 
 * @param {function} onHashtagAdded - A callback function to handle the addition of hashtags.
 * @returns {JSX.Element} The rendered header component.
 */
const Header = React.memo(({ onHashtagAdded }) => {
    const dispatch = useDispatch();

    /**
     * Handles the event when the "Clear Messages" button is clicked.
     * Dispatches an action to clear all messages from the chat.
     */
    const handleClearMessages = () => {
        dispatch(clearMessages());
    };

    // State for managing the dropdown key to force re-rendering
    const [dropdownKey, setDropdownKey] = useState(0);

    // Available hashtags for the dropdown
    const hashtags = [
        { key: 'diagram', text: '#diagram', value: '#diagram' },
    ];

    /**
     * Handles the addition of a hashtag selected from the dropdown.
     * 
     * @param {Event} e - The event object.
     * @param {Object} value - The selected value from the dropdown.
     */
    const addHashtag = (e, { value }) => {
        onHashtagAdded(value);
        setDropdownKey(prevKey => prevKey + 1);
    };

    return (
        <Container text fluid className="chat-container-header">
            <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                <Dropdown
                    key={dropdownKey}
                    className='icon dropdown'
                    options={hashtags}
                    onChange={addHashtag}
                    trigger={<Icon name='hashtag' className='hashtag-icon' data-testid="hashtag-icon" />}
                    pointing='top right'
                    icon={null}
                />
                <Icon className='delete-icon' data-testid="delete-icon" name='delete' link onClick={handleClearMessages} />
            </div>
        </Container>
    );
});

export default Header;
