import { Member, Prisma } from "@prisma/client";

import { MEMBER_ID_LENGTH } from "@/config/site";
import MemberRepository from "@/domains/member/repository";
import { generateSecureRandomString } from "@/libs/utils";

class MemberService {
  private memberRepository: MemberRepository;
  public memberId: string = "";

  constructor() {
    this.memberRepository = new MemberRepository();
    this.initializeMemberId();
  }

  private async initializeMemberId() {
    this.memberId = await this.generateMemberId();
  }

  /**
   * 会員登録済みかどうか
   * @param email
   * @returns Promise<boolean>
   */
  async isExisting(email: string): Promise<boolean> {
    try {
      const existingMember = await this.memberRepository.findByEmail(email);
      return existingMember ? true : false;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 会員番号を生成
   * @returns Promise<string>
   */
  async generateMemberId(): Promise<string> {
    try {
      const id = await generateSecureRandomString(MEMBER_ID_LENGTH);
      // 既に存在する会員番号でないか
      const existingMember = await this.memberRepository.get({ id });
      if (existingMember) {
        return this.generateMemberId();
      }
      return id;
    } catch (error) {
      throw error;
    }
  }

  /**
   * 会員登録
   * @param params
   * @returns Promise<Member>
   * @throws Error
   */
  async register(params: Prisma.MemberCreateInput): Promise<Member> {
    return await this.memberRepository.create(params);
  }

  /**
   * 会員情報を取得
   * @param ownerId
   * @returns Promise<Member | null>
   * @throws Error
   */
  async getCurrent(id: string): Promise<Member | null> {
    return await this.memberRepository.get({ id });
  }
}

export default MemberService;
