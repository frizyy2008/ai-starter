import { expect, test, type Page } from "@playwright/test";

const PASSWORD = "correct-horse-battery-1";

async function signUp(page: Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("Имя").fill("E2E");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Пароль").fill(PASSWORD);
  await page.getByRole("button", { name: "Зарегистрироваться" }).click();
  await expect(page).toHaveURL(/\/notes$/);
}

test("заметка создаётся через UI и остаётся после перезагрузки", async ({ page }) => {
  const title = `Первая заметка ${Date.now()}`;
  await signUp(page, `e2e-${Date.now()}@example.test`);
  await page.getByLabel("Заголовок").fill(title);
  await page.getByLabel("Текст").fill("Проверка персистентности");
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByRole("status")).toHaveText("Заметка сохранена");

  await page.reload();
  await expect(page.getByText(title)).toBeVisible();
});

test("пустая форма показывает ошибку и ничего не сохраняет", async ({ page }) => {
  await signUp(page, `e2e-empty-${Date.now()}@example.test`);
  await page.getByRole("button", { name: "Сохранить" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Проверьте поля формы" })).toBeVisible();
  await expect(page.getByText("Заметок пока нет.")).toBeVisible();
});

test("другой пользователь не видит чужие заметки", async ({ browser }) => {
  const title = `Секрет ${Date.now()}`;
  const alice = await browser.newPage();
  await signUp(alice, `alice-${Date.now()}@example.test`);
  await alice.getByLabel("Заголовок").fill(title);
  await alice.getByLabel("Текст").fill("только для Алисы");
  await alice.getByRole("button", { name: "Сохранить" }).click();
  await expect(alice.getByRole("status")).toHaveText("Заметка сохранена");

  const bobContext = await browser.newContext();
  const bob = await bobContext.newPage();
  await signUp(bob, `bob-${Date.now()}@example.test`);
  await expect(bob.getByText(title)).toHaveCount(0);
  await bobContext.close();
});

test("без входа /notes перенаправляет на /login", async ({ page }) => {
  await page.goto("/notes");
  await expect(page).toHaveURL(/\/login$/);
});
