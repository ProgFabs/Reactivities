import { observer } from 'mobx-react-lite';
import React, { useContext } from 'react'
import { Link } from 'react-router-dom';
import { Button, Item, Label, Segment } from 'semantic-ui-react';
import ActivityStore from "../../../app/stores/activityStore";

const ActivityList: React.FC = () => {
  const activityStore = useContext(ActivityStore);
  const { 
    activitiesByDate, 
    deleteActivity, 
    target, 
    submitting 
  } = activityStore;
  return (
    <Segment clearing>
      <Item.Group divided>
        {activitiesByDate.map((activity) => (
          <Item key={activity.id}>
            <Item.Content>
              <Item.Header as='a'>{activity.title}</Item.Header>
              <Item.Meta>{activity.date}</Item.Meta>
              <Item.Description>
                <div>{activity.description}</div>
                <div>{activity.city}, {activity.venue}</div>
              </Item.Description>
              <Item.Extra>
                <Button 
                  name={activity.id}
                  loading={target === activity.id && submitting} 
                  onClick={(e) => deleteActivity(e, activity.id)} 
                  floated="right" 
                  content="Delete" 
                  color="red" 
                  />
                <Button 
                  as={Link} to={`/activities/${activity.id}`}
                  floated="right" 
                  content="View" 
                  color="blue" 
                  />
                <Label basic content={activity.category} />
                </Item.Extra>
            </Item.Content>
          </Item>
        ))}
      </Item.Group>
    </Segment>
  )
}

export default observer(ActivityList);