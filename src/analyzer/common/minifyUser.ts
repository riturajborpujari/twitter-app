import * as TweetsSchema from '../../api/twitter/schema';
import * as AnalysisSchema from '../schema';

export default function MinifyUser(full_user: TweetsSchema.IUser): AnalysisSchema.IMinifiedUser {
    return {
        screen_name: full_user.screen_name,
        name: full_user.name,
        profile: {
            location: full_user.location,
            follower_count: full_user.profile.followers_count,
            friends_count: full_user.profile.friends_count,
            statuses_count: full_user.profile.meta.statuses_count
        },
        created_at: full_user.profile.meta.created_at
    };
}