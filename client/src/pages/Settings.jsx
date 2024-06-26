import {useState, react} from 'react';
import CampaignAccordion from '../components/CampaignAccordion';
import {Container, Card, Image, Button} from 'react-bootstrap';
import '../styling/App.css';
import DeleteGameModal from '../components/DeleteGameModal';
import useUserSettings from '../hooks/useUserSettings';
import SettingsWindow from '../components/SettingsWindow';
import UploadKeyModal from '../components/UploadKeyModal';
import DeleteUserModal from '../components/DeleteUserModal';

function Settings() {
    const [campaigns, setCampaigns] = useState([]);

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [isApiModal, setIsApiModal] = useState(true);

    const [campaignName, setCampaignName] = useState('');
    const [campaignId, setCampaignId] = useState('');
    const [apiKeyValid, setApiKeyValid] = useState(false);
    
   
    
    

    return (
        <Container fluid>
            <Image className="login-background" src="/Town.gif"/>  
            <Container fluid className="login-container"> 
                
                <Card bg="light" style={{ boxShadow: 'inset 0 0 10px #000000', height: "90vh", overflow: 'auto' }}>
                    <Card.Body>
                        <SettingsWindow handleShow={handleShow} apiKeyValid={apiKeyValid} setApiKeyValid={setApiKeyValid} setIsApiModal={setIsApiModal}/>
                    </Card.Body>
                </Card>
            </Container>
             {isApiModal ? <UploadKeyModal show={show} handleClose={handleClose} setApiKeyValid={setApiKeyValid}/> : <DeleteUserModal show={show} handleClose={handleClose}/> }
            
        </Container>
    );
};

export default Settings;