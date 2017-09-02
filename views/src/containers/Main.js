import React from 'react'
import ShowListings from './listings/listings.container.js'
import ShowModal from './toggleModal/toggleModal.container.js'
import Fetching from './listings/fetch.container.js'
import AdvanceFilter from './filters/advance.container.js'
import BasicFilter from './filters/basic.container.js'
import ShowReminders from './reminders/reminders.container.js'
import ShowMainAction from './mainAction/mainAction.container.js'
import ShowMenu from './menu/menu.container.js'
import {Grid,Icon,Menu,Input,Segment,Button,List,Dropdown,Accordion,Step,Image, Modal,Header,Table,Loader,Dimmer} from 'semantic-ui-react'

const Main=function(){
    return (
        <div>
            <div className="primary-menu">
                <Grid container>
                    <Grid.Row>
                        <Grid.Column width={16}>
                            <ShowMenu/>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </div>

            <Grid container>
                <Grid.Row>
                    <Grid.Column width={4}>
                        <ShowMainAction/>
                        <BasicFilter/>
                        <ShowReminders/>
                    </Grid.Column>
                    <Grid.Column width={12}>
                        <AdvanceFilter/>
                        <Fetching/>
                        <ShowListings/>
                        <ShowModal/>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </div>
    )
}

export default Main
