import { Injectable } from '@nestjs/common';
import { User, UserDocument } from '@poster-parlor-api/models';
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { UnauthorizedException } from '@poster-parlor-api/utils';
import {
  AuthResponse,
  JwtTokenPayload,
  Token,
} from '@poster-parlor-api/shared';
import { AppConfigService } from '@poster-parlor-api/config';
import { Response } from 'express';
@Injectable()
export class AuthService {
  private client: OAuth2Client;

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
    private config: AppConfigService
  ) {
    const clientId = this.config.authConfig.clientId;

    this.client = new OAuth2Client(clientId);
  }

  async verifyGoogleToken(idToken: string): Promise<TokenPayload> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken,
        audience: this.config.authConfig.clientId,
      });

      const payload = ticket.getPayload();
      if (!payload?.email || !payload.email_verified) {
        throw new UnauthorizedException('Invalid token or email not verified');
      }
      return payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid Google token :', error);
    }
  }

  async generateTokens(user: UserDocument): Promise<Token> {
    const payload: JwtTokenPayload = {
      sub: String(user._id),
      email: user.email,
      role: user.role,
    };

    const accessTokenExpiry = this.config.authConfig.jwtAccessTokenExpiry;
    const refreshTokenExpiry = this.config.authConfig.jwtRefreshTokenExpiry;

    const accessTokenSecret = this.config.authConfig.jwtAccessTokenSecret;
    const refreshTokenSecret = this.config.authConfig.jwtRefreshTokenSecret;

    if (!accessTokenSecret || !refreshTokenSecret) {
      throw new Error('JWT secrets are not configured');
    }

    const accessToken = this.jwtService.sign(payload, {
      secret: accessTokenSecret,
      expiresIn: accessTokenExpiry,
    } as JwtSignOptions);

    const refreshToken = this.jwtService.sign(payload, {
      secret: refreshTokenSecret,
      expiresIn: refreshTokenExpiry,
    } as JwtSignOptions);

    return { accessToken, refreshToken };
  }

  setCookies(res: Response, tokens: Token): void {
    const accessTokenMaxAge = this.config.authConfig.jwtAccessTokenExpiry;
    const refreshTokenMaxAge = this.config.authConfig.jwtRefreshTokenExpiry;

    // Set access token cookie
    res.cookie('access_token', tokens.accessToken, {
      httpOnly: true,
      secure: this.config.isProduction,
      sameSite: this.config.isProduction ? 'none' : 'lax',
      maxAge: accessTokenMaxAge,
      path: '/',
    });

    // Set refresh token cookie
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: this.config.isProduction,
      sameSite: this.config.isProduction ? 'none' : 'lax',
      maxAge: refreshTokenMaxAge,
      path: '/',
    });
  }

  ///Login With google

  async loginWithGoogle(idToken: string, res: Response): Promise<AuthResponse> {
    const googlePayload = await this.verifyGoogleToken(idToken);

    const { email, name, sub: googleId } = googlePayload;

    if (!email || !name) {
      throw new UnauthorizedException('Missing required user information');
    }

    let user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      user = await this.userModel.create({
        name,
        email,
        googleId,
        lastLogin: new Date(),
        isActive: true,
      });
    } else {
      if (!user.isActive) {
        throw new UnauthorizedException('Account is temporarily disabled');
      }
      user.lastLogin = new Date();
      await user.save();
    }

    const tokens = await this.generateTokens(user);
    this.setCookies(res, tokens);

    return {
      accessToken: tokens.accessToken,
      user: {
        id: String(user._id),
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async logout(res: Response): Promise<{ message: string }> {
    // Clear access token cookie
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: this.config.isProduction,
      sameSite: this.config.isProduction ? 'none' : 'lax',
      path: '/',
    });

    // Clear refresh token cookie
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: this.config.isProduction,
      sameSite: this.config.isProduction ? 'none' : 'lax',
      path: '/',
    });

    return { message: 'Logged out successfully' };
  }

  async refreshAccessToken(
    refreshAccessToken: string,
    res: Response // ✅ Add res parameter
  ): Promise<{ accessToken: string }> {
    try {
      const refreshTokenSecret = this.config.authConfig.jwtRefreshTokenSecret;

      if (!refreshTokenSecret) {
        throw new Error('JWT refresh secret is not configured');
      }

      const payload = this.jwtService.verify<JwtTokenPayload>(
        refreshAccessToken,
        {
          secret: refreshTokenSecret,
        }
      );

      const user = await this.userModel.findById(payload.sub).exec();
      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }
      if (!user.isActive) {
        throw new UnauthorizedException('User account is temporarily disabled');
      }

      const accessTokenSecret = this.config.authConfig.jwtAccessTokenSecret;

      if (!accessTokenSecret) {
        throw new Error('JWT access secret is not configured');
      }
      const accessTokenExpiry = this.config.authConfig.jwtAccessTokenExpiry;

      const newPayload: JwtTokenPayload = {
        sub: String(user._id),
        email: user.email,
        role: user.role,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        secret: accessTokenSecret,
        expiresIn: accessTokenExpiry,
      } as JwtSignOptions);

      // ✅ Set the new access token in cookie
      res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: this.config.isProduction,
        sameSite: this.config.isProduction ? 'none' : 'lax',
        maxAge: accessTokenExpiry,
        path: '/',
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token', error);
    }
  }
}
