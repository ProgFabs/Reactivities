import React, { FormEvent, useState, useContext, useEffect } from 'react'
import { Button, Form, Segment } from 'semantic-ui-react';
import IActivity from '../../../app/models/activity';
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStore";
import { RouteComponentProps } from 'react-router-dom';

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({ match, history }) => {
  const activityStore = useContext(ActivityStore);
  const { 
    createActivity, 
    editActivity, 
    activity: initialFormState, 
    loadActivity,
    clearActivity
  } = activityStore;
  
  const [activity, setActivity] = useState<IActivity>({
        id: '',
        title: '',
        category: '',
        description: '',
        date: '',
        city: '',
        venue: '',
  });

  useEffect(() => {
    if(match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id).then(
        () => initialFormState && setActivity(initialFormState)
      );
    };

    return (() => {
      clearActivity();
    })
  }, [loadActivity, clearActivity, match.params.id, initialFormState, activity.id.length]);

  const handleInputChange = (event: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {name, value} = event.currentTarget;  
    setActivity({...activity, [name]: value});  
  };

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid(),
      }
      createActivity(newActivity).then(() => history.push(`/activities/${newActivity.id}`));

    } else {
      console.log(activity.id);
      editActivity(activity).then(() => history.push(`/activities/${activity.id}`));
    }
  }

  return (
    <Segment clearing>
      <Form onSubmit={handleSubmit}>
        <Form.Input placeholder="Title" name="title" onChange={handleInputChange} value={activity.title} />
        <Form.TextArea rows={2} placeholder="Description" name="description" onChange={handleInputChange} value={activity.description} />
        <Form.Input placeholder="Category" name="category" onChange={handleInputChange} value={activity.category} />
        <Form.Input type="datetime-local" placeholder="Date" name="date" onChange={handleInputChange} value={activity.date} />
        <Form.Input placeholder="City" name="city" onChange={handleInputChange} value={activity.city} />
        <Form.Input placeholder="Venue" name="venue" onChange={handleInputChange} value={activity.venue} />
        <Button loading={activityStore.submitting} floated="right" positive type="submit" content="Submit" />
        <Button onClick={() => history.push('/activities')} floated="right" type="button" content="Cancel" />
      </Form>
    </Segment>
  )
}

export default ActivityForm;