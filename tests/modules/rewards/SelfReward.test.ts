import { describe, it, expect, beforeEach } from "vitest";
import { SelfReward } from "@/modules/rewards/domain/SelfReward";
import { LocalStorageRewardRepository } from "@/modules/rewards/infrastructure/LocalStorageRewardRepository";

describe("SelfReward Domain Entity", () => {
  it("initializes with pending status", () => {
    const reward = SelfReward.create({
      title: "Traktir kopi spesial & roti",
      targetStreak: 7,
    }).unwrap();

    expect(reward.status).toBe("pending");
    expect(reward.targetStreak).toBe(7);
    expect(reward.earnedDate).toBeNull();
    expect(reward.claimedDate).toBeNull();
  });

  it("transitions to earned when streak reaches target", () => {
    const reward = SelfReward.create({
      title: "Nonton bioskop",
      targetStreak: 7,
    }).unwrap();

    const isEarned = reward.checkEligibility(7);
    expect(isEarned).toBe(true);
    expect(reward.status).toBe("earned");
    expect(reward.earnedDate).not.toBeNull();
  });

  it("does not transition to earned if streak is below target", () => {
    const reward = SelfReward.create({
      title: "Nonton bioskop",
      targetStreak: 7,
    }).unwrap();

    const isEarned = reward.checkEligibility(6);
    expect(isEarned).toBe(false);
    expect(reward.status).toBe("pending");
    expect(reward.earnedDate).toBeNull();
  });

  it("transitions to claimed when claimed by user", () => {
    const reward = SelfReward.create({
      title: "Beli buku baru",
      targetStreak: 7,
      status: "earned",
    }).unwrap();

    reward.claim();
    expect(reward.status).toBe("claimed");
    expect(reward.claimedDate).not.toBeNull();
  });

  it("fails if title is empty or whitespace", () => {
    const res = SelfReward.create({ title: "   ", targetStreak: 7 });
    expect(res.isErr()).toBe(true);
    expect(res.getError()).toBe("Nama self-reward tidak boleh kosong");
  });

  it("updates title if new title is valid", () => {
    const reward = SelfReward.create({
      title: "Apresiasi lama",
      targetStreak: 7,
    }).unwrap();

    reward.updateTitle("Apresiasi baru yang hebat");
    expect(reward.title).toBe("Apresiasi baru yang hebat");

    // Ignored if blank
    reward.updateTitle("   ");
    expect(reward.title).toBe("Apresiasi baru yang hebat");
  });

  it("correctly serializes to JSON", () => {
    const reward = SelfReward.create({
      title: "Hadiah santai",
      targetStreak: 14,
    }).unwrap();

    const json = reward.toJSON();
    expect(json.id).toBe(reward.id);
    expect(json.title).toBe("Hadiah santai");
    expect(json.targetStreak).toBe(14);
    expect(json.status).toBe("pending");
  });
});

describe("LocalStorageRewardRepository", () => {
  let repository: LocalStorageRewardRepository;

  beforeEach(() => {
    localStorage.clear();
    repository = new LocalStorageRewardRepository("test_kaizen_rewards");
  });

  it("saves and retrieves rewards", async () => {
    const reward = SelfReward.create({
      title: "Piknik akhir pekan",
      targetStreak: 7,
    }).unwrap();

    await repository.save(reward);
    const all = await repository.getAll();
    expect(all.length).toBe(1);
    expect(all[0].title).toBe("Piknik akhir pekan");
  });

  it("retrieves the active reward prioritizing earned over pending", async () => {
    const pendingReward = SelfReward.create({
      title: "Pending Reward",
      targetStreak: 14,
      status: "pending",
    }).unwrap();

    const earnedReward = SelfReward.create({
      title: "Earned Reward",
      targetStreak: 7,
      status: "earned",
    }).unwrap();

    await repository.save(pendingReward);
    await repository.save(earnedReward);

    const active = await repository.getActiveReward();
    expect(active).not.toBeNull();
    expect(active?.title).toBe("Earned Reward");
  });

  it("deletes a reward by id", async () => {
    const reward = SelfReward.create({
      title: "Reward to delete",
      targetStreak: 7,
    }).unwrap();

    await repository.save(reward);
    await repository.delete(reward.id);

    const all = await repository.getAll();
    expect(all.length).toBe(0);
  });
});
