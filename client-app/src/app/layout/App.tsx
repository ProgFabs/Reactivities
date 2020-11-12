import React, { useState, useEffect, SyntheticEvent } from 'react';
import './styles.css';
import { Container } from 'semantic-ui-react';
import IActivity from "../models/activity";
import { NavBar } from '../../features/nav/NavBar';
import ActivityDashboard from "../../features/activities/dashboard/ActivityDashboard";
import Activities from "../api/agent"
import LoadingComponent from './LoadingComponent';

function App() {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [selectedActivity, setSelectedActivity] = useState<IActivity | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [target, setTarget] = useState('');

  const handleSelectActivity = (id: string) => {
    setSelectedActivity(activities.filter(a => a.id === id)[0]);
    setEditMode(false);
  };

  const handleOpenCreateFrom = () => {
    setSelectedActivity(null);
    setEditMode(true);
  };

  const handleCreateActivity = (activity: IActivity) => {
    setSubmitting(true);
    Activities.create(activity).then(() => {
      setActivities([...activities, activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  };

  const handleEditActivity = (activity: IActivity) => {
    setSubmitting(true);
    Activities.update(activity).then(() => {
      setActivities([...activities.filter(a => a.id !== activity.id), activity]);
      setSelectedActivity(activity);
      setEditMode(false);
    }).then(() => setSubmitting(false));
  };

  const handleDeleteActivity = (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
    setSubmitting(true);
    setTarget(event.currentTarget.name);
    Activities.delete(id).then(() => {
      setActivities([...activities.filter(a => a.id !== id)]);
    }).then(() => setSubmitting(false));    
  }

  useEffect(() => {
    Activities.list().then((response) => {
      let activities: IActivity[] = [];

      response.forEach((activity) => {
        activity.date = activity.date.split('.')[0];
        activities.push(activity);
      })
      setActivities(activities);
    }).then(() => setLoading(false));
  }, []);

  if (loading) return <LoadingComponent content={"Loading activities..."} />

  return (
    <>
      <NavBar openCreateForm={handleOpenCreateFrom} />
      <Container style={{ marginTop: '7em' }}>
        <ActivityDashboard 
        activities={activities} 
        selectActivity={handleSelectActivity} 
        selectedActivity={selectedActivity}
        setSelectedActivity={setSelectedActivity}
        editMode={editMode}
        setEditMode={setEditMode}
        createActivity={handleCreateActivity}
        editActivity={handleEditActivity}
        deleteActivity={handleDeleteActivity}
        submitting={submitting}
        target={target}
        />
      </Container>
    </>
  );
}

export default App;
