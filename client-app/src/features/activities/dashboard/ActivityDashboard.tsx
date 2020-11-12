import React, { SyntheticEvent } from 'react';
import { Grid } from 'semantic-ui-react';
import IActivity from '../../../app/models/activity';
import ActivityDetails from '../details/ActivityDetails';
import ActivityForm from '../form/ActivityForm';
import ActivityList from './ActivityList';

interface IProps {
  activities: IActivity[];
  selectActivity: (id: string) => void;
  selectedActivity: IActivity | null;
  setSelectedActivity: (activity: IActivity | null) => void;
  editMode: boolean;
  setEditMode: (editMode: boolean) => void; 
  createActivity: (activity: IActivity) => void;
  editActivity: (activity: IActivity) => void;
  deleteActivity: (event: SyntheticEvent<HTMLButtonElement>, id: string) => void;
  submitting: boolean;
  target: string;
}

const ActivityDashboard: React.FC<IProps> = ({
  activities, 
  selectActivity, 
  selectedActivity,
  setSelectedActivity,
  editMode,
  setEditMode,
  createActivity,
  editActivity,
  deleteActivity,
  submitting,
  target,
}) => {
  return (
    <div>
      <Grid>
        <Grid.Column width={10}>
          <ActivityList 
            activities={activities} 
            selectActivity={selectActivity} 
            deleteActivity={deleteActivity} 
            target={target}
            submitting={submitting}
          />
        </Grid.Column>
        <Grid.Column width={6}>
          {selectedActivity && !editMode && (
          <ActivityDetails 
            activity={selectedActivity} 
            setEditMode={setEditMode} 
            setSelectedActivity={setSelectedActivity} 
          />
          )}

          {editMode && (
          <ActivityForm 
            key={selectedActivity && selectedActivity.id || 0}
            setEditMode={setEditMode} 
            activity={selectedActivity} 
            createActivity={createActivity}
            editActivity={editActivity}
            submitting={submitting}
          />
          )}
        </Grid.Column>
      </Grid>
    </div>
  )
}

export default ActivityDashboard;