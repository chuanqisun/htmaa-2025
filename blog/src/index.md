---
title: HTMAA 2025 Sun Chuanqi
layout: "base.njk"
---

Welcome to my course blog for How To Make (Almost) Anything (HTMAA).  
I'll publish weekly articles on the things I've learned and report my progress towards the final project.

{% for post in collections.post limit: 100 reversed %}

<!-- hide the "post" tag because it is self-evidence -->

- [{{ post.data.title }}](.{{ post.url }}) {{ post.data.date | humanDate }} {% for tag in post.data.keywords %} #{{ tag }}{% endfor %}

{% endfor %}
