self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open("qfos-core").then((c) =>
      c.addAll(["/", "/index.html"])
    )
  );
});
