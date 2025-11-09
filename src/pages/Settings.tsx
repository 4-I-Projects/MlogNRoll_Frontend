import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { User } from '../lib/types';
import { Separator } from '../ui/separator';

interface SettingsProps {
  currentUser: User;
}

export function Settings({ currentUser }: SettingsProps) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="max-w-2xl space-y-6">
            <div>
              <h3 className="mb-4">Profile Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback>{currentUser.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Change photo
                    </Button>
                    <p className="text-sm text-gray-500 mt-1">
                      JPG, PNG or GIF. Max size 2MB.
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue={currentUser.name} />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    defaultValue={currentUser.bio}
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    type="url" 
                    placeholder="https://example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    placeholder="San Francisco, CA"
                  />
                </div>

                <Button>Save Changes</Button>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="account">
          <div className="max-w-2xl space-y-6">
            <div>
              <h3 className="mb-4">Account Settings</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    defaultValue="user@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username" 
                    defaultValue="username"
                  />
                </div>

                <Button>Update Account</Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-4">Change Password</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input 
                    id="current-password" 
                    type="password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input 
                    id="new-password" 
                    type="password"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>
                  <Input 
                    id="confirm-password" 
                    type="password"
                  />
                </div>

                <Button>Change Password</Button>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-4 text-red-600">Danger Zone</h3>
              <Button variant="destructive">Delete Account</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="max-w-2xl space-y-6">
            <div>
              <h3 className="mb-4">Email Notifications</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div>New followers</div>
                    <p className="text-sm text-gray-500">
                      Get notified when someone follows you
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div>Comments</div>
                    <p className="text-sm text-gray-500">
                      Get notified when someone comments on your story
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div>Likes and claps</div>
                    <p className="text-sm text-gray-500">
                      Get notified when someone likes your story
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div>New stories from writers you follow</div>
                    <p className="text-sm text-gray-500">
                      Get notified when writers you follow publish
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <div>Weekly digest</div>
                    <p className="text-sm text-gray-500">
                      Receive a weekly summary of activity
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-4">Push Notifications</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div>Enable push notifications</div>
                    <p className="text-sm text-gray-500">
                      Receive notifications on your device
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <Button>Save Preferences</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
