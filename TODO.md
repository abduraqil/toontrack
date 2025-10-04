# User page

- [ ] report button:
    - [ ] three strikes, saved in users.strikes
    - [ ]
- [ ] visibility settings:
    - [ ] choose what stats to show
    - [ ] figure out how to save user settings
    - [ ] modify user query to retrieve stats according to settings
- [ ] privacy settings, three options:
    - [ ] all NULL (default)
    - [ ] friends TRUE
    - [ ] none FALSE
- [x] friends Ul:
    - [x] adding
    - [x] delete
    - [x] accept

# Edit pages

- [ ] "create new" option
- [ ] image upload:
    - [ ] enforce max size
    - [ ] enforce max resolution
- [ ] find solution to query searching for:
    - [ ] characters
    - [ ] staff
- [ ] add new characters from cartoon edit page
- [ ] save edit differences to staging table:
    - [ ] mod page to show, modify, and accept differences?

# Search

- [x] links that don't go anywhere
- [ ] pagination
- [ ] refactor

# Database

## Data Cleaning

- [ ] REMOVE THE FOLLOWING cartoon_types AND ANYTHING THAT USES THEM EXCLUSIVELY any item that has these types and only these types then they must be removed as well if they have these types and other types then just remove the entry that has this type in jt_cartoons_cartoon_types

```sql
    select * from cartoon_types where id in (4167410, 13406463, 13415160, 113480583, 62573441, 112158242, 15711870, 39911916, 37038, 20650540, 117209498, 63952888, 29876482, 620749, 27132946, 27120684, 108387267, 15706911, 2916510,8274 ,21198342, 196600,603948, 170584, 732577,274079,111048186, 3275581, 56350999, 167270, 7889, 7058673, 1030329, 47461344, 838948, 7366);
```

- [ ] trim languages list - so many not real languages: Atlantian???, silent, multiple, pidgin, sign language, Finnish
- [ ] heavily trim tags list
    - [ ] remove redundant tags: comedy film => {comedy, (remove film)}, comedy drama => {comedy, drama}
    - [ ] remove useless/erroneous tags
- [ ] remove historical / religious figures from tables staff & characters
- [ ] perhaps remove all real people from characters or at least remove many of them
- [ ] Replace all real photographs with cartoon screenshots for characters

## Management

- [ ] Add staging tables to allow moderators to differentiate between user suggested edits
- [ ] Add trigger to check for and delete old sessions and users
- [x] Write cronjob to clean up expired requests

# Misc.

- [ ] fix: bottom nav links
- [ ] grep -Ri TODO
- [ ] comment section on various pages
- refactor:
    - [ ] remove useless interfaces, replace with ORM
    - [ ] remove useless console.logs
    - [ ] remove useless comments
