---
title: HTMAA 2025 Sun Chuanqi
layout: "base.njk"
---

Hey, it's Sun. Welcome to my course blog for [How To Make (Almost) Anything](https://fab.cba.mit.edu/classes/MAS.863/) (HTMAA), fall 2025.  
I'll publish weekly articles on the things I've learned and report progress towards the final project.

I joined the [Tangible Media Group](https://tangible.media.mit.edu/) at the [MIT Media Lab](https://www.media.mit.edu/) in 2025. My [research interest](https://medialab.chuanqisun.com/?secret=empathy) is in the social, cultural, and philosophical aspects of generative AI. I've previously worked as a software engineer at Microsoft and enjoy [building tools](https://chuanqisun.com/) for the open source community.

{% for post in collections.post limit: 100 %}

<!-- hide the "post" tag because it is self-evidence -->

- [{{ post.data.title }}]({{ post.url }}) {{ post.data.date | humanDate }} {% for tag in post.data.keywords %} #{{ tag }}{% endfor %}

{% endfor %}
